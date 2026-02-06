from fastapi import APIRouter, HTTPException, Depends
from middleware import require_role
from models import RejectRequest, SuspendRequest, gen_id, now_iso
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/admin", tags=["admin"])

db = None


def set_db(database):
    global db
    db = database


@router.get("/dashboard")
async def dashboard(user=Depends(require_role("ADMIN"))):
    today = now_iso()[:10]

    total_orders = await db.orders.count_documents({"created_at": {"$regex": f"^{today}"}})
    active_orders = await db.orders.count_documents({"status": {"$in": ["CREATED", "ASSIGNED", "ACCEPTED", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY"]}})
    delivered_orders = await db.orders.count_documents({"status": "DELIVERED"})
    active_sellers = await db.users.count_documents({"role": "SELLER", "approval_status": "APPROVED", "status": "ACTIVE"})
    active_delivery = await db.users.count_documents({"role": "DELIVERY", "approval_status": "APPROVED", "status": "ACTIVE"})
    pending_approvals = await db.users.count_documents({"approval_status": "PENDING", "role": {"$in": ["SELLER", "DELIVERY"]}})

    recent_logs = await db.audit_logs.find(
        {}, {"_id": 0}
    ).sort("created_at", -1).to_list(10)

    return {
        "total_orders_today": total_orders,
        "active_orders": active_orders,
        "delivered_orders": delivered_orders,
        "active_sellers": active_sellers,
        "active_delivery_partners": active_delivery,
        "pending_approvals": pending_approvals,
        "recent_activity": recent_logs,
    }


@router.get("/sellers")
async def get_sellers(status: str = "all", user=Depends(require_role("ADMIN"))):
    query = {"role": "SELLER"}
    if status != "all":
        query["approval_status"] = status.upper()

    sellers = await db.users.find(query, {"_id": 0}).to_list(1000)
    return {"sellers": sellers}


@router.post("/sellers/{seller_id}/approve")
async def approve_seller(seller_id: str, user=Depends(require_role("ADMIN"))):
    seller = await db.users.find_one({"id": seller_id, "role": "SELLER"}, {"_id": 0})
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")

    await db.users.update_one(
        {"id": seller_id},
        {"$set": {"approval_status": "APPROVED", "status": "ACTIVE"}}
    )

    await db.audit_logs.insert_one({
        "id": gen_id(),
        "actor_id": user["user_id"],
        "actor_role": "ADMIN",
        "action": "SELLER_APPROVED",
        "entity": "user",
        "entity_id": seller_id,
        "details": f"Seller {seller.get('shop_name', seller_id)} approved",
        "created_at": now_iso(),
    })

    return {"success": True}


@router.post("/sellers/{seller_id}/reject")
async def reject_seller(seller_id: str, req: RejectRequest, user=Depends(require_role("ADMIN"))):
    seller = await db.users.find_one({"id": seller_id, "role": "SELLER"}, {"_id": 0})
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")

    await db.users.update_one(
        {"id": seller_id},
        {"$set": {"approval_status": "REJECTED"}}
    )

    await db.audit_logs.insert_one({
        "id": gen_id(),
        "actor_id": user["user_id"],
        "actor_role": "ADMIN",
        "action": "SELLER_REJECTED",
        "entity": "user",
        "entity_id": seller_id,
        "details": f"Seller rejected. Reason: {req.reason}",
        "created_at": now_iso(),
    })

    return {"success": True}


@router.post("/sellers/{seller_id}/suspend")
async def suspend_seller(seller_id: str, req: SuspendRequest, user=Depends(require_role("ADMIN"))):
    await db.users.update_one(
        {"id": seller_id},
        {"$set": {"approval_status": "SUSPENDED", "status": "SUSPENDED"}}
    )

    await db.audit_logs.insert_one({
        "id": gen_id(),
        "actor_id": user["user_id"],
        "actor_role": "ADMIN",
        "action": "SELLER_SUSPENDED",
        "entity": "user",
        "entity_id": seller_id,
        "details": f"Seller suspended. Reason: {req.reason}",
        "created_at": now_iso(),
    })

    return {"success": True}


@router.get("/delivery-partners")
async def get_delivery_partners(status: str = "all", user=Depends(require_role("ADMIN"))):
    query = {"role": "DELIVERY"}
    if status != "all":
        query["approval_status"] = status.upper()

    partners = await db.users.find(query, {"_id": 0}).to_list(1000)
    return {"delivery_partners": partners}


@router.post("/delivery-partners/{partner_id}/approve")
async def approve_delivery(partner_id: str, user=Depends(require_role("ADMIN"))):
    await db.users.update_one(
        {"id": partner_id},
        {"$set": {"approval_status": "APPROVED", "status": "ACTIVE"}}
    )

    await db.audit_logs.insert_one({
        "id": gen_id(),
        "actor_id": user["user_id"],
        "actor_role": "ADMIN",
        "action": "DELIVERY_PARTNER_APPROVED",
        "entity": "user",
        "entity_id": partner_id,
        "details": f"Delivery partner {partner_id} approved",
        "created_at": now_iso(),
    })

    return {"success": True}


@router.post("/delivery-partners/{partner_id}/suspend")
async def suspend_delivery(partner_id: str, req: SuspendRequest, user=Depends(require_role("ADMIN"))):
    await db.users.update_one(
        {"id": partner_id},
        {"$set": {"approval_status": "SUSPENDED", "status": "SUSPENDED"}}
    )

    await db.audit_logs.insert_one({
        "id": gen_id(),
        "actor_id": user["user_id"],
        "actor_role": "ADMIN",
        "action": "DELIVERY_PARTNER_SUSPENDED",
        "entity": "user",
        "entity_id": partner_id,
        "details": f"Delivery partner suspended. Reason: {req.reason}",
        "created_at": now_iso(),
    })

    return {"success": True}


@router.get("/orders")
async def get_orders(status: str = "all", user=Depends(require_role("ADMIN"))):
    query = {}
    if status != "all":
        query["status"] = status.upper()

    orders = await db.orders.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return {"orders": orders}


@router.get("/earnings")
async def get_earnings(role: str = "all", user=Depends(require_role("ADMIN"))):
    query = {}
    if role != "all":
        query["role"] = role.upper()

    earnings = await db.earnings.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)

    total = sum(e["amount"] for e in earnings)
    paid = sum(e["amount"] for e in earnings if e["status"] == "PAID")
    pending = sum(e["amount"] for e in earnings if e["status"] == "PENDING")

    return {"total": total, "paid": paid, "pending": pending, "earnings": earnings}


@router.get("/users")
async def get_users(role: str = "all", user=Depends(require_role("ADMIN"))):
    query = {}
    if role != "all":
        query["role"] = role.upper()

    users = await db.users.find(query, {"_id": 0}).to_list(1000)
    return {"users": users}


@router.post("/users/{user_id}/suspend")
async def suspend_user(user_id: str, req: SuspendRequest, user=Depends(require_role("ADMIN"))):
    await db.users.update_one(
        {"id": user_id},
        {"$set": {"status": "SUSPENDED"}}
    )

    await db.audit_logs.insert_one({
        "id": gen_id(),
        "actor_id": user["user_id"],
        "actor_role": "ADMIN",
        "action": "USER_SUSPENDED",
        "entity": "user",
        "entity_id": user_id,
        "details": f"User suspended. Reason: {req.reason}",
        "created_at": now_iso(),
    })

    return {"success": True}


@router.post("/users/{user_id}/reactivate")
async def reactivate_user(user_id: str, user=Depends(require_role("ADMIN"))):
    await db.users.update_one(
        {"id": user_id},
        {"$set": {"status": "ACTIVE"}}
    )

    await db.audit_logs.insert_one({
        "id": gen_id(),
        "actor_id": user["user_id"],
        "actor_role": "ADMIN",
        "action": "USER_REACTIVATED",
        "entity": "user",
        "entity_id": user_id,
        "details": f"User {user_id} reactivated",
        "created_at": now_iso(),
    })

    return {"success": True}


@router.get("/audit-logs")
async def get_audit_logs(role: str = "all", user=Depends(require_role("ADMIN"))):
    query = {}
    if role != "all":
        query["actor_role"] = role.upper()

    logs = await db.audit_logs.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return {"logs": logs}


@router.get("/products")
async def get_products(status: str = "all", user=Depends(require_role("ADMIN"))):
    query = {}
    if status != "all":
        query["status"] = status.upper()

    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    return {"products": products}


@router.post("/products/{product_id}/approve")
async def approve_product(product_id: str, user=Depends(require_role("ADMIN"))):
    await db.products.update_one(
        {"id": product_id},
        {"$set": {"status": "APPROVED"}}
    )

    await db.audit_logs.insert_one({
        "id": gen_id(),
        "actor_id": user["user_id"],
        "actor_role": "ADMIN",
        "action": "PRODUCT_APPROVED",
        "entity": "product",
        "entity_id": product_id,
        "details": f"Product {product_id} approved",
        "created_at": now_iso(),
    })

    return {"success": True}


@router.post("/products/{product_id}/reject")
async def reject_product(product_id: str, user=Depends(require_role("ADMIN"))):
    await db.products.update_one(
        {"id": product_id},
        {"$set": {"status": "REJECTED"}}
    )
    return {"success": True}


@router.get("/profile")
async def get_profile(user=Depends(require_role("ADMIN"))):
    admin = await db.users.find_one({"id": user["user_id"]}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    return {
        "phone": admin["phone"],
        "role": admin["role"],
        "created_at": admin.get("created_at", ""),
    }
