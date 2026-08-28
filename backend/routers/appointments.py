from datetime import datetime
from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Optional
from models.schemas import Appointment, AppointmentCreate
from database.mongo import get_db, clean_mongo_doc, clean_mongo_docs
from database.store import db_store

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])

@router.get("", response_model=List[Appointment])
async def get_all_appointments(
    date: Optional[str] = Query(None, description="Filter by YYYY-MM-DD"),
    doctor_id: Optional[str] = Query(None, description="Filter by Doctor ID"),
    status: Optional[str] = Query(None, description="Filter by Status")
):
    db = get_db()
    if db is not None:
        try:
            query = {}
            if date:
                query["appointment_date"] = date
            if doctor_id:
                query["doctor_id"] = doctor_id
            if status and status != "All":
                query["status"] = status
            cursor = db.appointments.find(query).sort("token_number", 1)
            docs = await cursor.to_list(length=200)
            return clean_mongo_docs(docs)
        except Exception:
            pass

    apts = db_store.appointments
    if date:
        apts = [a for a in apts if a["appointment_date"] == date]
    if doctor_id:
        apts = [a for a in apts if a["doctor_id"] == doctor_id]
    if status and status != "All":
        apts = [a for a in apts if a["status"] == status]
    return apts

@router.post("", response_model=Appointment, status_code=201)
async def create_appointment(payload: AppointmentCreate):
    db = get_db()
    today_tokens = []
    
    if db is not None:
        try:
            cursor = db.appointments.find({"appointment_date": payload.appointment_date}, {"token_number": 1})
            docs = await cursor.to_list(length=200)
            today_tokens = [d.get("token_number", 0) for d in docs]
        except Exception:
            today_tokens = [a["token_number"] for a in db_store.appointments if a["appointment_date"] == payload.appointment_date]
    else:
        today_tokens = [a["token_number"] for a in db_store.appointments if a["appointment_date"] == payload.appointment_date]

    next_token = max(today_tokens, default=0) + 1
    new_id = f"APT-2026-{len(today_tokens) + 101}"

    apt_dict = payload.model_dump()
    apt_dict["id"] = new_id
    apt_dict["token_number"] = next_token
    apt_dict["created_at"] = datetime.now().isoformat() + "Z"

    if db is not None:
        try:
            doc_to_save = dict(apt_dict)
            doc_to_save.pop("_id", None)
            res = await db.appointments.insert_one(doc_to_save)
            doc_to_save["_id"] = str(res.inserted_id)
            db_store.appointments.append(apt_dict)
            return doc_to_save
        except Exception:
            pass

    db_store.appointments.append(apt_dict)
    return apt_dict

@router.patch("/{appointment_id}/status")
async def update_appointment_status(appointment_id: str, status: str = Body(..., embed=True)):
    db = get_db()
    if db is not None:
        try:
            res = await db.appointments.update_one({"id": appointment_id}, {"$set": {"status": status}})
            if res.matched_count > 0:
                updated = await db.appointments.find_one({"id": appointment_id})
                return {"message": "Status updated successfully", "appointment": clean_mongo_doc(updated)}
        except Exception:
            pass

    for idx, a in enumerate(db_store.appointments):
        if a["id"].lower() == appointment_id.lower():
            a["status"] = status
            db_store.appointments[idx] = a
            return {"message": "Status updated successfully", "appointment": a}

    raise HTTPException(status_code=404, detail="Appointment not found")
