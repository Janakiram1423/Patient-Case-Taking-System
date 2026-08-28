from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from models.schemas import Patient, PatientCreate, PatientBase
from database.mongo import get_db, clean_mongo_doc, clean_mongo_docs
from database.store import db_store

router = APIRouter(prefix="/api/patients", tags=["Patients"])

@router.get("", response_model=List[Patient])
async def get_all_patients(search: Optional[str] = Query(None, description="Search by name, ID, or phone")):
    db = get_db()
    if db is not None:
        try:
            query = {}
            if search:
                s = search.strip()
                query = {
                    "$or": [
                        {"name": {"$regex": s, "$options": "i"}},
                        {"patient_id": {"$regex": s, "$options": "i"}},
                        {"phone": {"$regex": s, "$options": "i"}}
                    ]
                }
            cursor = db.patients.find(query).sort("created_at", -1)
            docs = await cursor.to_list(length=200)
            return clean_mongo_docs(docs)
        except Exception:
            pass

    # Fallback to in-memory store
    patients = db_store.patients
    if search:
        s = search.lower().strip()
        return [
            p for p in patients
            if s in p["name"].lower() or s in p["patient_id"].lower() or s in p.get("phone", "")
        ]
    return patients

@router.get("/{patient_id}", response_model=Patient)
async def get_patient_by_id(patient_id: str):
    db = get_db()
    if db is not None:
        try:
            doc = await db.patients.find_one({"patient_id": {"$regex": f"^{patient_id}$", "$options": "i"}})
            if doc:
                return clean_mongo_doc(doc)
        except Exception:
            pass

    for p in db_store.patients:
        if p["patient_id"].lower() == patient_id.lower():
            return p
    raise HTTPException(status_code=404, detail="Patient not found")

@router.post("", response_model=Patient, status_code=201)
async def create_patient(payload: PatientCreate):
    db = get_db()
    next_num = 1
    if db is not None:
        try:
            count = await db.patients.count_documents({})
            next_num = count + 1
        except Exception:
            next_num = len(db_store.patients) + 1
    else:
        next_num = len(db_store.patients) + 1

    new_id = payload.patient_id or f"PAT-2026-{next_num:04d}"
    new_patient = payload.model_dump()
    new_patient["patient_id"] = new_id
    new_patient["created_at"] = datetime.now().isoformat() + "Z"

    if db is not None:
        try:
            doc_to_save = dict(new_patient)
            doc_to_save.pop("_id", None)
            res = await db.patients.insert_one(doc_to_save)
            doc_to_save["_id"] = str(res.inserted_id)
            # Sync to in-memory too
            db_store.patients.insert(0, new_patient)
            return doc_to_save
        except Exception:
            pass

    db_store.patients.insert(0, new_patient)
    return new_patient

@router.put("/{patient_id}", response_model=Patient)
async def update_patient(patient_id: str, payload: PatientBase):
    db = get_db()
    updated_data = payload.model_dump()
    updated_data["patient_id"] = patient_id

    if db is not None:
        try:
            existing = await db.patients.find_one({"patient_id": patient_id})
            if existing:
                updated_data["created_at"] = existing.get("created_at", datetime.now().isoformat() + "Z")
                await db.patients.update_one({"patient_id": patient_id}, {"$set": updated_data})
                return clean_mongo_doc(await db.patients.find_one({"patient_id": patient_id}))
        except Exception:
            pass

    for idx, p in enumerate(db_store.patients):
        if p["patient_id"].lower() == patient_id.lower():
            updated_data["created_at"] = p.get("created_at", datetime.now().isoformat() + "Z")
            db_store.patients[idx] = updated_data
            return updated_data

    raise HTTPException(status_code=404, detail="Patient not found")
