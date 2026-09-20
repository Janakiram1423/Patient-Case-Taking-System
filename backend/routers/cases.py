import hashlib
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models.schemas import CaseRecord, CaseRecordCreate
from database.mongo import get_db, clean_mongo_doc, clean_mongo_docs
from database.store import db_store

router = APIRouter(prefix="/api/cases", tags=["Cases"])

async def case_with_patient_details(case: dict, db) -> dict:
    if case.get("patient_details"):
        return case

    patient_details = None
    if db is not None:
        try:
            patient_details = clean_mongo_doc(await db.patients.find_one({"patient_id": case.get("patient_id")}))
        except Exception:
            patient_details = None
    if not patient_details:
        patient_details = next(
            (patient for patient in db_store.patients if patient.get("patient_id", "").lower() == case.get("patient_id", "").lower()),
            None
        )

    return {**case, "patient_details": patient_details}

@router.get("", response_model=List[CaseRecord])
async def get_all_cases(
    patient_id: Optional[str] = Query(None, description="Filter by Patient ID"),
    doctor_id: Optional[str] = Query(None, description="Filter by Doctor ID")
):
    db = get_db()
    if db is not None:
        try:
            query = {}
            if patient_id:
                query["patient_id"] = {"$regex": f"^{patient_id}$", "$options": "i"}
            if doctor_id:
                query["doctor_id"] = doctor_id
            cursor = db.cases.find(query).sort("created_at", -1)
            docs = await cursor.to_list(length=200)
            return [await case_with_patient_details(case, db) for case in clean_mongo_docs(docs)]
        except Exception:
            pass

    cases = db_store.cases
    if patient_id:
        cases = [c for c in cases if c["patient_id"].lower() == patient_id.lower()]
    if doctor_id:
        cases = [c for c in cases if c["doctor_id"].lower() == doctor_id.lower()]
    return [await case_with_patient_details(case, db) for case in cases]

@router.get("/{case_id}", response_model=CaseRecord)
async def get_case_by_id(case_id: str):
    db = get_db()
    if db is not None:
        try:
            doc = await db.cases.find_one({"case_id": {"$regex": f"^{case_id}$", "$options": "i"}})
            if doc:
                return await case_with_patient_details(clean_mongo_doc(doc), db)
        except Exception:
            pass

    for c in db_store.cases:
        if c["case_id"].lower() == case_id.lower():
            return await case_with_patient_details(c, db)
    raise HTTPException(status_code=404, detail="Case record not found")

@router.post("", response_model=CaseRecord, status_code=201)
async def create_case(payload: CaseRecordCreate):
    db = get_db()

    patient_details = payload.patient_details
    if not patient_details:
        if db is not None:
            try:
                patient_details = clean_mongo_doc(await db.patients.find_one({"patient_id": payload.patient_id}))
            except Exception:
                patient_details = None
        if not patient_details:
            patient_details = next(
                (patient for patient in db_store.patients if patient.get("patient_id", "").lower() == payload.patient_id.lower()),
                None
            )
    
    # Calculate unique case_id & visit number
    visit_num = 1
    total_cases = 0
    if db is not None:
        try:
            total_cases = await db.cases.count_documents({})
            patient_cases_count = await db.cases.count_documents({"patient_id": payload.patient_id})
            visit_num = patient_cases_count + 1
        except Exception:
            total_cases = len(db_store.cases)
            visit_num = len([c for c in db_store.cases if c["patient_id"] == payload.patient_id]) + 1
    else:
        total_cases = len(db_store.cases)
        visit_num = len([c for c in db_store.cases if c["patient_id"] == payload.patient_id]) + 1

    next_num = 8800 + total_cases + 1
    new_case_id = f"CASE-2026-{next_num}"
    created_at_str = datetime.now().isoformat() + "Z"

    case_dict = payload.model_dump()
    case_dict["patient_details"] = patient_details
    case_dict["case_id"] = new_case_id
    case_dict["visit_number"] = visit_num
    case_dict["created_at"] = created_at_str

    # Digital signature hash
    content_str = f"{new_case_id}:{payload.patient_id}:{payload.doctor_id}:{created_at_str}"
    sig_hash = f"SHA256:{hashlib.sha256(content_str.encode()).hexdigest()}"

    case_dict["digital_signature"] = {
        "signed_by": payload.doctor_name,
        "registration_no": "MCI-REG-847291",
        "timestamp": created_at_str,
        "hash": sig_hash
    }

    if db is not None:
        try:
            doc_to_save = dict(case_dict)
            doc_to_save.pop("_id", None)
            res = await db.cases.insert_one(doc_to_save)
            doc_to_save["_id"] = str(res.inserted_id)

            # Also log audit
            await db.audit_logs.insert_one({
                "id": f"LOG-{datetime.now().strftime('%Y%m%d%H%M%S')}",
                "timestamp": created_at_str,
                "user_id": payload.doctor_id,
                "user_name": payload.doctor_name,
                "role": "doctor",
                "action": "CREATE_CASE_RECORD",
                "module": "Clinical Case Taking",
                "details": f"Created case {new_case_id} for Patient {payload.patient_id}",
                "ip_address": "127.0.0.1"
            })
            
            db_store.cases.insert(0, case_dict)
            return doc_to_save
        except Exception:
            pass

    db_store.cases.insert(0, case_dict)
    return case_dict

@router.post("/{case_id}/sign", response_model=CaseRecord)
async def sign_case(case_id: str):
    now_iso = datetime.now().isoformat() + "Z"
    sig_hash = f"SHA256:{hashlib.sha256(f'{case_id}:{now_iso}'.encode()).hexdigest()}"
    
    db = get_db()
    if db is not None:
        try:
            existing = await db.cases.find_one({"case_id": case_id})
            if existing:
                sig_data = {
                    "signed_by": existing.get("doctor_name", "Attending Physician"),
                    "registration_no": "MCI-REG-VERIFIED",
                    "timestamp": now_iso,
                    "hash": sig_hash
                }
                await db.cases.update_one(
                    {"case_id": case_id},
                    {"$set": {"status": "Signed", "digital_signature": sig_data}}
                )
                return clean_mongo_doc(await db.cases.find_one({"case_id": case_id}))
        except Exception:
            pass

    for idx, c in enumerate(db_store.cases):
        if c["case_id"].lower() == case_id.lower():
            c["status"] = "Signed"
            c["digital_signature"] = {
                "signed_by": c["doctor_name"],
                "registration_no": "MCI-REG-VERIFIED",
                "timestamp": now_iso,
                "hash": sig_hash
            }
            db_store.cases[idx] = c
            return c

    raise HTTPException(status_code=404, detail="Case record not found")
