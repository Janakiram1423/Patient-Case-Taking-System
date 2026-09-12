import os
import logging
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("clinibase.db")

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "clinicase_db")

# Global MongoDB references
mongo_client = None
db = None
is_mongo_connected = False

def get_db():
    return db

async def connect_to_mongo():
    global mongo_client, db, is_mongo_connected
    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        logger.info(f"Connecting to MongoDB at {MONGODB_URI.split('@')[-1] if '@' in MONGODB_URI else MONGODB_URI}...")
        
        # Connect with 5-second server selection timeout
        mongo_client = AsyncIOMotorClient(
            MONGODB_URI,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000
        )
        
        # Test ping
        await mongo_client.admin.command('ping')
        db = mongo_client[DATABASE_NAME]
        is_mongo_connected = True
        logger.info(f" Successfully connected to MongoDB Database: '{DATABASE_NAME}'")
        
        # Seed initial documents if empty
        await seed_initial_data_if_needed()
        
    except Exception as e:
        is_mongo_connected = False
        logger.warning(f"⚠️ MongoDB connection failed: {e}. Falling back to in-memory store for instant readiness.")

async def close_mongo_connection():
    global mongo_client, is_mongo_connected
    if mongo_client:
        mongo_client.close()
        is_mongo_connected = False
        logger.info("MongoDB connection closed.")

async def seed_initial_data_if_needed():
    from database.store import db_store
    if db is None:
        return
    
    try:
        # 1. Patients
        patients_count = await db.patients.count_documents({})
        if patients_count == 0:
            for p in db_store.patients:
                p_copy = dict(p)
                p_copy.pop("_id", None)
                await db.patients.insert_one(p_copy)
            logger.info("Seeded initial patients into MongoDB.")

        # 2. Cases
        cases_count = await db.cases.count_documents({})
        if cases_count == 0:
            for c in db_store.cases:
                c_copy = dict(c)
                c_copy.pop("_id", None)
                await db.cases.insert_one(c_copy)
            logger.info("Seeded initial cases into MongoDB.")

        # 3. Appointments
        apt_count = await db.appointments.count_documents({})
        if apt_count == 0:
            for a in db_store.appointments:
                a_copy = dict(a)
                a_copy.pop("_id", None)
                await db.appointments.insert_one(a_copy)
            logger.info("Seeded initial appointments into MongoDB.")

        # 4. Users / Staff
        users_count = await db.users.count_documents({})
        if users_count == 0:
            for u in db_store.users:
                u_copy = dict(u)
                u_copy.pop("_id", None)
                await db.users.insert_one(u_copy)
            logger.info("Seeded initial staff/users into MongoDB.")

        # 5. Hospital Info
        info_count = await db.hospital_info.count_documents({})
        if info_count == 0:
            info_copy = dict(db_store.hospital_info)
            info_copy.pop("_id", None)
            await db.hospital_info.insert_one(info_copy)
            logger.info("Seeded initial hospital info into MongoDB.")

        # 6. Audit Logs
        logs_count = await db.audit_logs.count_documents({})
        if logs_count == 0:
            for l in db_store.audit_logs:
                l_copy = dict(l)
                l_copy.pop("_id", None)
                await db.audit_logs.insert_one(l_copy)
            logger.info("Seeded initial audit logs into MongoDB.")

    except Exception as e:
        logger.error(f"Error seeding MongoDB collections: {e}")

def clean_mongo_doc(doc: Optional[dict]) -> Optional[dict]:
    """Helper to convert Mongo _id to string or remove it for clean Pydantic validation."""
    if not doc:
        return None
    cleaned = dict(doc)
    if "_id" in cleaned:
        cleaned["_id"] = str(cleaned["_id"])
    return cleaned

def clean_mongo_docs(docs: list) -> list:
    return [clean_mongo_doc(d) for d in docs]
