from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
import re
from models.schemas import Patient, PatientCreate, PatientBase
from database.mongo import get_db, clean_mongo_doc, clean_mongo_docs
from database.store import db_store

router = APIRouter(prefix="/api/patients", tags=["Patients"])

def patient_with_uhid(patient: dict) -> dict:
    if patient.get("uhid"):
        return patient
    patient_id = patient.get("patient_id", "")
    match = re.search(r"^PAT-(\d{4})-(\d+)$", patient_id)
    if match:
        patient["uhid"] = f"UHID-{match.group(1)}-{int(match.group(2)):04d}"
    else:
        patient["uhid"] = f"UHID-{datetime.now().year}-{abs(hash(patient_id)) % 10000:04d}"
    return patient

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
                        {"uhid": {"$regex": s, "$options": "i"}},
                        {"phone": {"$regex": s, "$options": "i"}}
                    ]
                }
            cursor = db.patients.find(query).sort("created_at", -1)
            docs = await cursor.to_list(length=200)
            return [patient_with_uhid(patient) for patient in clean_mongo_docs(docs)]
        except Exception:
            pass

    # Fallback to in-memory store
    patients = db_store.patients
    if search:
        s = search.lower().strip()
        return [
            patient_with_uhid(p) for p in patients
            if s in p["name"].lower() or s in p["patient_id"].lower() or s in p.get("phone", "") or s in p.get("uhid", "").lower()
        ]
    return [patient_with_uhid(patient) for patient in patients]

@router.get("/{patient_id}", response_model=Patient)
async def get_patient_by_id(patient_id: str):
    db = get_db()
    if db is not None:
        try:
            doc = await db.patients.find_one({"patient_id": {"$regex": f"^{patient_id}$", "$options": "i"}})
            if doc:
                return patient_with_uhid(clean_mongo_doc(doc))
        except Exception:
            pass

    for p in db_store.patients:
        if p["patient_id"].lower() == patient_id.lower():
            return patient_with_uhid(p)
    raise HTTPException(status_code=404, detail="Patient not found")

@router.post("", response_model=Patient, status_code=201)
async def create_patient(payload: PatientCreate):
    db = get_db()
    existing_ids = []
    if db is not None:
        try:
            existing_ids = await db.patients.distinct("patient_id")
        except Exception:
            existing_ids = [patient.get("patient_id", "") for patient in db_store.patients]
    else:
        existing_ids = [patient.get("patient_id", "") for patient in db_store.patients]

    existing_uhids = []
    if db is not None:
        try:
            existing_uhids = await db.patients.distinct("uhid")
        except Exception:
            existing_uhids = [patient.get("uhid", "") for patient in db_store.patients]
    else:
        existing_uhids = [patient.get("uhid", "") for patient in db_store.patients]

    current_year = datetime.now().year
    used_numbers = [
        int(patient_id.rsplit("-", 1)[1])
        for patient_id in existing_ids
        if isinstance(patient_id, str)
        and patient_id.startswith(f"PAT-{current_year}-")
        and patient_id.rsplit("-", 1)[1].isdigit()
    ]
    next_num = max(used_numbers, default=0) + 1

    requested_id = payload.patient_id.strip() if payload.patient_id else ""
    new_id = requested_id if requested_id and requested_id not in existing_ids else f"PAT-{current_year}-{next_num:04d}"
    requested_uhid = payload.uhid.strip()
    used_uhid_numbers = [
        int(uhid.rsplit("-", 1)[1])
        for uhid in existing_uhids
        if isinstance(uhid, str)
        and uhid.startswith(f"UHID-{current_year}-")
        and uhid.rsplit("-", 1)[1].isdigit()
    ]
    next_uhid = f"UHID-{current_year}-{(max(used_uhid_numbers, default=0) + 1):04d}"
    new_patient = payload.model_dump()
    if not new_patient.get("registration_number"):
        existing_reg_numbers = [
            patient.get("registration_number", "")
            for patient in db_store.patients
            if isinstance(patient.get("registration_number"), str)
        ]
        year_prefix = str(current_year)
        used_reg_nums = [
            int(reg.rsplit("-", 1)[1])
            for reg in existing_reg_numbers
            if isinstance(reg, str) and reg.startswith(f"REG-{year_prefix}-") and reg.rsplit("-", 1)[1].isdigit()
        ]
        new_patient["registration_number"] = f"REG-{year_prefix}-{(max(used_reg_nums, default=0) + 1):04d}"
    new_patient["patient_id"] = new_id
    new_patient["uhid"] = requested_uhid if requested_uhid and requested_uhid not in existing_uhids else next_uhid
    new_patient["created_at"] = datetime.now().isoformat() + "Z"

    if db is not None:
        try:
            doc_to_save = dict(new_patient)
            doc_to_save.pop("_id", None)
            res = await db.patients.insert_one(doc_to_save)
            doc_to_save["_id"] = str(res.inserted_id)
            # Sync to in-memory too
            db_store.patients.insert(0, new_patient)
            return patient_with_uhid(doc_to_save)
        except Exception:
            pass

    db_store.patients.insert(0, new_patient)
    return patient_with_uhid(new_patient)

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
                return patient_with_uhid(clean_mongo_doc(await db.patients.find_one({"patient_id": patient_id})))
        except Exception:
            pass

    for idx, p in enumerate(db_store.patients):
        if p["patient_id"].lower() == patient_id.lower():
            updated_data["created_at"] = p.get("created_at", datetime.now().isoformat() + "Z")
            db_store.patients[idx] = updated_data
            return patient_with_uhid(updated_data)

    raise HTTPException(status_code=404, detail="Patient not found")

@router.delete("/{patient_id}", status_code=204)
async def delete_patient(patient_id: str):
    db = get_db()
    if db is not None:
        try:
            result = await db.patients.delete_one({"patient_id": {"$regex": f"^{patient_id}$", "$options": "i"}})
            if result.deleted_count:
                return None
        except Exception:
            pass

    for index, patient in enumerate(db_store.patients):
        if patient.get("patient_id", "").lower() == patient_id.lower():
            db_store.patients.pop(index)
            return None

    raise HTTPException(status_code=404, detail="Patient not found")
