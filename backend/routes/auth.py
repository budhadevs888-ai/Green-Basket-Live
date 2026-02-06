from fastapi import APIRouter, HTTPException
from models import SendOTPRequest, VerifyOTPRequest, gen_id, now_iso
from middleware import create_token
import random
import os
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["auth"])

# Will be set from server.py
db = None

OTP_MODE = os.environ.get("OTP_MODE", "development")
DEV_OTP = "123456"


def set_db(database):
    global db
    db = database


@router.post("/send-otp")
async def send_otp(req: SendOTPRequest):
    phone = req.phone.strip()
    if not phone or len(phone) < 10:
        raise HTTPException(status_code=400, detail="Invalid phone number")

    if OTP_MODE == "development":
        otp = DEV_OTP
    else:
        otp = str(random.randint(100000, 999999))

    await db.otp_store.update_one(
        {"phone": phone},
        {"$set": {"phone": phone, "otp": otp, "created_at": now_iso()}},
        upsert=True
    )

    logger.info(f"OTP for {phone}: {otp}")
    return {"success": True, "message": "OTP sent successfully"}


@router.post("/verify-otp")
async def verify_otp(req: VerifyOTPRequest):
    phone = req.phone.strip()
    role = req.role.upper()

    if role not in ["CUSTOMER", "SELLER", "DELIVERY", "ADMIN"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    stored = await db.otp_store.find_one({"phone": phone}, {"_id": 0})
    if not stored:
        raise HTTPException(status_code=400, detail="OTP not found. Please request a new one.")

    if stored["otp"] != req.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    await db.otp_store.delete_one({"phone": phone})

    user = await db.users.find_one({"phone": phone, "role": role}, {"_id": 0})

    if not user:
        if role == "ADMIN":
            raise HTTPException(status_code=403, detail="Admin account not found. Admin accounts are pre-created.")

        user_id = gen_id()
        user = {
            "id": user_id,
            "phone": phone,
            "role": role,
            "status": "ACTIVE",
            "approval_status": "APPROVED" if role == "CUSTOMER" else "PENDING",
            "city": "",
            "latitude": 0,
            "longitude": 0,
            "address": "",
            "house": "",
            "area": "",
            "pincode": "",
            "shop_name": "",
            "bank_info": "",
            "categories": [],
            "daily_stock_confirmed": False,
            "daily_stock_date": "",
            "is_available": False,
            "location_set": False,
            "created_at": now_iso(),
        }
        await db.users.insert_one({**user})

        await db.audit_logs.insert_one({
            "id": gen_id(),
            "actor_id": user_id,
            "actor_role": role,
            "action": "USER_REGISTERED",
            "entity": "user",
            "entity_id": user_id,
            "details": f"New {role} registered with phone {phone}",
            "created_at": now_iso(),
        })

    token = create_token(user["id"], user["role"], user.get("city", ""), user["status"], user["phone"])

    redirect = _get_redirect(user)

    safe_user = {k: v for k, v in user.items() if k != "_id"}

    return {"token": token, "user": safe_user, "redirect": redirect}


@router.get("/me")
async def get_me(user=None):
    from middleware import get_current_user
    return {"message": "Use with auth header"}


def _get_redirect(user):
    role = user["role"]
    approval = user.get("approval_status", "APPROVED")

    if role == "CUSTOMER":
        if not user.get("location_set"):
            return "/customer/location-setup"
        return "/customer/home"

    if role == "SELLER":
        if approval != "APPROVED":
            return "/seller/approval-status"
        today = now_iso()[:10]
        if user.get("daily_stock_date", "") != today:
            return "/seller/daily-stock"
        return "/seller/dashboard"

    if role == "DELIVERY":
        if approval != "APPROVED":
            return "/delivery/approval-status"
        return "/delivery/availability"

    if role == "ADMIN":
        return "/admin/dashboard"

    return "/"
