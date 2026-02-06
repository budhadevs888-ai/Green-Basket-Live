from fastapi import APIRouter, HTTPException, Depends
from middleware import require_role
from models import AvailabilityRequest, DeliveryOTPRequest, gen_id, now_iso
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/delivery", tags=["delivery"])

db = None


def set_db(database):
    global db
    db = database


@router.post("/availability")
async def set_availability(req: AvailabilityRequest, user=Depends(require_role("DELIVERY"))):
    delivery = await db.users.find_one({"id": user["user_id"]}, {"_id": 0})
    if not delivery or delivery.get("approval_status") != "APPROVED":
        raise HTTPException(status_code=403, detail="Not approved")

    await db.users.update_one(
        {"id": user["user_id"]},
        {"$set": {"is_available": req.is_available}}
    )
    return {"success": True, "is_available": req.is_available}


@router.get("/active-order")
async def get_active_order(user=Depends(require_role("DELIVERY"))):
    order = await db.orders.find_one({
        "delivery_partner_id": user["user_id"],
        "status": {"$in": ["READY_FOR_PICKUP", "OUT_FOR_DELIVERY"]}
    }, {"_id": 0})

    if not order:
        return {"order": None}

    seller = await db.users.find_one({"id": order.get("seller_id", "")}, {"_id": 0})
    seller_info = {
        "name": seller.get("shop_name", "Seller") if seller else "Seller",
        "address": seller.get("address", "") if seller else "",
        "phone": seller.get("phone", "") if seller else "",
    }

    return {
        "order": {
            **order,
            "seller_info": seller_info,
            "customer_address": order.get("delivery_address", {}),
        }
    }


@router.post("/orders/{order_id}/pickup")
async def start_pickup(order_id: str, user=Depends(require_role("DELIVERY"))):
    order = await db.orders.find_one({
        "id": order_id,
        "delivery_partner_id": user["user_id"],
    }, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order["status"] != "READY_FOR_PICKUP":
        raise HTTPException(status_code=400, detail="Order not ready for pickup")

    await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": "OUT_FOR_DELIVERY", "updated_at": now_iso()}}
    )

    await db.audit_logs.insert_one({
        "id": gen_id(),
        "actor_id": user["user_id"],
        "actor_role": "DELIVERY",
        "action": "PICKUP_STARTED",
        "entity": "order",
        "entity_id": order_id,
        "details": f"Delivery partner picked up order {order_id}",
        "created_at": now_iso(),
    })

    return {"success": True}


@router.post("/orders/{order_id}/verify-otp")
async def verify_delivery_otp(order_id: str, req: DeliveryOTPRequest, user=Depends(require_role("DELIVERY"))):
    order = await db.orders.find_one({
        "id": order_id,
        "delivery_partner_id": user["user_id"],
    }, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order["status"] != "OUT_FOR_DELIVERY":
        raise HTTPException(status_code=400, detail="Order not out for delivery")

    if order.get("delivery_otp", "") != req.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # Mark delivered
    await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": "DELIVERED", "updated_at": now_iso()}}
    )

    # Create earnings
    seller_earning = order.get("total_amount", 0) * 0.85
    delivery_earning = order.get("total_amount", 0) * 0.10

    await db.earnings.insert_one({
        "id": gen_id(),
        "user_id": order.get("seller_id", ""),
        "user_name": "",
        "role": "SELLER",
        "order_id": order_id,
        "amount": round(seller_earning, 2),
        "status": "PENDING",
        "created_at": now_iso(),
    })

    await db.earnings.insert_one({
        "id": gen_id(),
        "user_id": user["user_id"],
        "user_name": "",
        "role": "DELIVERY",
        "order_id": order_id,
        "amount": round(delivery_earning, 2),
        "status": "PENDING",
        "created_at": now_iso(),
    })

    # Reset delivery partner availability
    await db.users.update_one(
        {"id": user["user_id"]},
        {"$set": {"is_available": False}}
    )

    await db.audit_logs.insert_one({
        "id": gen_id(),
        "actor_id": user["user_id"],
        "actor_role": "DELIVERY",
        "action": "ORDER_DELIVERED",
        "entity": "order",
        "entity_id": order_id,
        "details": f"Order {order_id} delivered via OTP verification",
        "created_at": now_iso(),
    })

    return {
        "success": True,
        "delivery_earning": round(delivery_earning, 2),
    }


class DeliveryRegisterRequest(BaseModel):
    city: str
    address: str
    latitude: float
    longitude: float
    vehicle_type: str = ""
    vehicle_number: str = ""


@router.post("/register")
async def register_delivery(req: DeliveryRegisterRequest, user=Depends(require_role("DELIVERY"))):
    partner_id = user["user_id"]
    partner = await db.users.find_one({"id": partner_id}, {"_id": 0})
    if partner and partner.get("city"):
        return {"success": True, "message": "Already registered", "redirect": "/delivery/approval-status"}

    await db.users.update_one(
        {"id": partner_id},
        {"$set": {
            "city": req.city,
            "address": req.address,
            "latitude": req.latitude,
            "longitude": req.longitude,
            "vehicle_type": req.vehicle_type,
            "vehicle_number": req.vehicle_number,
        }}
    )

    await db.audit_logs.insert_one({
        "id": gen_id(),
        "actor_id": partner_id,
        "actor_role": "DELIVERY",
        "action": "DELIVERY_PARTNER_REGISTERED",
        "entity": "user",
        "entity_id": partner_id,
        "details": f"Delivery partner submitted registration in {req.city}",
        "created_at": now_iso(),
    })

    return {"success": True, "redirect": "/delivery/approval-status"}


@router.get("/earnings")
async def get_earnings(user=Depends(require_role("DELIVERY"))):
    earnings = await db.earnings.find(
        {"user_id": user["user_id"]}, {"_id": 0}
    ).sort("created_at", -1).to_list(1000)

    total = sum(e["amount"] for e in earnings)
    paid = sum(e["amount"] for e in earnings if e["status"] == "PAID")
    pending = sum(e["amount"] for e in earnings if e["status"] == "PENDING")

    return {"total": total, "paid": paid, "pending": pending, "transactions": earnings}


@router.get("/history")
async def get_history(user=Depends(require_role("DELIVERY"))):
    orders = await db.orders.find({
        "delivery_partner_id": user["user_id"],
        "status": "DELIVERED"
    }, {"_id": 0}).sort("updated_at", -1).to_list(100)
    return {"deliveries": orders}


@router.get("/profile")
async def get_profile(user=Depends(require_role("DELIVERY"))):
    delivery = await db.users.find_one({"id": user["user_id"]}, {"_id": 0})
    if not delivery:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "phone": delivery["phone"],
        "city": delivery.get("city", ""),
        "approval_status": delivery.get("approval_status", "PENDING"),
        "is_available": delivery.get("is_available", False),
        "created_at": delivery.get("created_at", ""),
    }
