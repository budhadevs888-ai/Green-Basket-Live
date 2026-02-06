from fastapi import APIRouter, HTTPException, Depends
from middleware import require_role, get_current_user
from models import (
    BulkProductRequest, PriceUpdateRequest,
    StockConfirmRequest, StockAdjustRequest, gen_id, now_iso
)
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/seller", tags=["seller"])

db = None


def set_db(database):
    global db
    db = database


def seller_dep():
    return require_role("SELLER")


@router.get("/dashboard")
async def dashboard(user=Depends(require_role("SELLER"))):
    seller_id = user["user_id"]
    today = now_iso()[:10]

    orders = await db.orders.find(
        {"seller_id": seller_id}, {"_id": 0}
    ).to_list(1000)

    today_orders = [o for o in orders if o.get("created_at", "")[:10] == today]
    assigned = len([o for o in today_orders if o["status"] == "ASSIGNED"])
    accepted = len([o for o in today_orders if o["status"] in ["ACCEPTED", "READY_FOR_PICKUP"]])

    products = await db.products.find(
        {"seller_id": seller_id, "status": "APPROVED"}, {"_id": 0}
    ).to_list(1000)

    healthy = len([p for p in products if p.get("stock", 0) > 10])
    low = len([p for p in products if 0 < p.get("stock", 0) <= 10])
    out = len([p for p in products if p.get("stock", 0) == 0])

    earnings_list = await db.earnings.find(
        {"user_id": seller_id}, {"_id": 0}
    ).to_list(1000)

    today_earnings = sum(e["amount"] for e in earnings_list if e.get("created_at", "")[:10] == today)
    total_pending = sum(e["amount"] for e in earnings_list if e["status"] == "PENDING")

    warnings_count = await db.warnings.count_documents({"seller_id": seller_id})

    return {
        "today_orders": {"assigned": assigned, "accepted": accepted, "total": len(today_orders)},
        "stock_health": {"healthy": healthy, "low": low, "out_of_stock": out},
        "earnings": {"today": today_earnings, "pending": total_pending},
        "warnings_count": warnings_count,
    }


@router.get("/products")
async def get_products(user=Depends(require_role("SELLER"))):
    products = await db.products.find(
        {"seller_id": user["user_id"]}, {"_id": 0}
    ).to_list(1000)
    return {"products": products}


@router.post("/products/bulk")
async def add_products_bulk(req: BulkProductRequest, user=Depends(require_role("SELLER"))):
    seller_id = user["user_id"]
    created = []
    for item in req.products:
        product = {
            "id": gen_id(),
            "seller_id": seller_id,
            "name": item.name,
            "unit": item.unit,
            "seller_price": item.price,
            "status": "PENDING",
            "stock": 0,
            "created_at": now_iso(),
        }
        await db.products.insert_one({**product})
        created.append(product)

    await db.audit_logs.insert_one({
        "id": gen_id(),
        "actor_id": seller_id,
        "actor_role": "SELLER",
        "action": "PRODUCTS_ADDED",
        "entity": "product",
        "entity_id": "",
        "details": f"Added {len(created)} products for approval",
        "created_at": now_iso(),
    })

    return {"success": True, "products": created}


@router.patch("/products/{product_id}/price")
async def update_price(product_id: str, req: PriceUpdateRequest, user=Depends(require_role("SELLER"))):
    product = await db.products.find_one(
        {"id": product_id, "seller_id": user["user_id"]}, {"_id": 0}
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product["status"] != "APPROVED":
        raise HTTPException(status_code=400, detail="Can only update price of approved products")

    await db.products.update_one(
        {"id": product_id},
        {"$set": {"seller_price": req.price}}
    )
    return {"success": True}


@router.get("/stock")
async def get_stock(user=Depends(require_role("SELLER"))):
    products = await db.products.find(
        {"seller_id": user["user_id"], "status": "APPROVED"}, {"_id": 0}
    ).to_list(1000)

    stock_items = []
    for p in products:
        stock = p.get("stock", 0)
        status = "out" if stock == 0 else "low" if stock <= 10 else "healthy"
        stock_items.append({
            "id": p["id"],
            "product_name": p["name"],
            "unit": p["unit"],
            "current_stock": stock,
            "status": status,
        })
    return {"stock_items": stock_items}


@router.post("/stock/daily-confirm")
async def daily_stock_confirm(req: StockConfirmRequest, user=Depends(require_role("SELLER"))):
    seller_id = user["user_id"]
    today = now_iso()[:10]

    for item in req.items:
        await db.products.update_one(
            {"id": item.product_id, "seller_id": seller_id},
            {"$set": {"stock": item.stock}}
        )

    await db.users.update_one(
        {"id": seller_id},
        {"$set": {"daily_stock_confirmed": True, "daily_stock_date": today}}
    )

    await db.audit_logs.insert_one({
        "id": gen_id(),
        "actor_id": seller_id,
        "actor_role": "SELLER",
        "action": "DAILY_STOCK_CONFIRMED",
        "entity": "stock",
        "entity_id": seller_id,
        "details": f"Confirmed stock for {len(req.items)} products",
        "created_at": now_iso(),
    })

    return {"success": True, "redirect": "/seller/dashboard"}


@router.patch("/stock/{product_id}/adjust")
async def adjust_stock(product_id: str, req: StockAdjustRequest, user=Depends(require_role("SELLER"))):
    if req.adjustment not in [-1, 1]:
        raise HTTPException(status_code=400, detail="Adjustment must be +1 or -1")

    product = await db.products.find_one(
        {"id": product_id, "seller_id": user["user_id"]}, {"_id": 0}
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    new_stock = max(0, product.get("stock", 0) + req.adjustment)
    await db.products.update_one(
        {"id": product_id},
        {"$set": {"stock": new_stock}}
    )

    await db.stock_logs.insert_one({
        "id": gen_id(),
        "seller_id": user["user_id"],
        "product_id": product_id,
        "adjustment": req.adjustment,
        "new_stock": new_stock,
        "created_at": now_iso(),
    })

    return {"success": True, "new_stock": new_stock}


@router.get("/orders")
async def get_orders(user=Depends(require_role("SELLER"))):
    orders = await db.orders.find(
        {"seller_id": user["user_id"], "status": {"$in": ["ASSIGNED", "ACCEPTED", "READY_FOR_PICKUP"]}},
        {"_id": 0}
    ).to_list(1000)
    return {"orders": orders}


@router.post("/orders/{order_id}/accept")
async def accept_order(order_id: str, user=Depends(require_role("SELLER"))):
    order = await db.orders.find_one(
        {"id": order_id, "seller_id": user["user_id"]}, {"_id": 0}
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order["status"] != "ASSIGNED":
        raise HTTPException(status_code=400, detail="Order can only be accepted from ASSIGNED state")

    for item in order.get("items", []):
        product = await db.products.find_one(
            {"id": item["product_id"], "seller_id": user["user_id"]}, {"_id": 0}
        )
        if product:
            new_stock = max(0, product.get("stock", 0) - item["quantity"])
            await db.products.update_one(
                {"id": item["product_id"]},
                {"$set": {"stock": new_stock}}
            )

    await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": "ACCEPTED", "updated_at": now_iso()}}
    )

    await db.audit_logs.insert_one({
        "id": gen_id(),
        "actor_id": user["user_id"],
        "actor_role": "SELLER",
        "action": "ORDER_ACCEPTED",
        "entity": "order",
        "entity_id": order_id,
        "details": f"Seller accepted order {order_id}, stock deducted",
        "created_at": now_iso(),
    })

    return {"success": True}


@router.post("/orders/{order_id}/ready")
async def mark_ready(order_id: str, user=Depends(require_role("SELLER"))):
    order = await db.orders.find_one(
        {"id": order_id, "seller_id": user["user_id"]}, {"_id": 0}
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order["status"] != "ACCEPTED":
        raise HTTPException(status_code=400, detail="Order must be ACCEPTED before marking ready")

    await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": "READY_FOR_PICKUP", "updated_at": now_iso()}}
    )

    # Auto-assign delivery partner
    delivery_partner = await db.users.find_one({
        "role": "DELIVERY",
        "approval_status": "APPROVED",
        "is_available": True,
        "status": "ACTIVE",
    }, {"_id": 0})

    if delivery_partner:
        import random
        delivery_otp = str(random.randint(100000, 999999))
        if os.environ.get("OTP_MODE", "development") == "development":
            delivery_otp = "123456"

        await db.orders.update_one(
            {"id": order_id},
            {"$set": {
                "delivery_partner_id": delivery_partner["id"],
                "delivery_otp": delivery_otp,
            }}
        )
        await db.users.update_one(
            {"id": delivery_partner["id"]},
            {"$set": {"is_available": False}}
        )

    await db.audit_logs.insert_one({
        "id": gen_id(),
        "actor_id": user["user_id"],
        "actor_role": "SELLER",
        "action": "ORDER_READY",
        "entity": "order",
        "entity_id": order_id,
        "details": f"Order {order_id} marked ready for pickup",
        "created_at": now_iso(),
    })

    return {"success": True}


@router.get("/earnings")
async def get_earnings(user=Depends(require_role("SELLER"))):
    earnings = await db.earnings.find(
        {"user_id": user["user_id"]}, {"_id": 0}
    ).sort("created_at", -1).to_list(1000)

    total = sum(e["amount"] for e in earnings)
    paid = sum(e["amount"] for e in earnings if e["status"] == "PAID")
    pending = sum(e["amount"] for e in earnings if e["status"] == "PENDING")

    return {
        "total": total,
        "paid": paid,
        "pending": pending,
        "transactions": earnings,
    }


@router.get("/warnings")
async def get_warnings(user=Depends(require_role("SELLER"))):
    warnings = await db.warnings.find(
        {"seller_id": user["user_id"]}, {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return {"warnings": warnings}


@router.get("/profile")
async def get_profile(user=Depends(require_role("SELLER"))):
    seller = await db.users.find_one({"id": user["user_id"]}, {"_id": 0})
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")

    total_orders = await db.orders.count_documents({
        "seller_id": user["user_id"], "status": "DELIVERED"
    })

    return {
        "id": seller["id"],
        "phone": seller["phone"],
        "shop_name": seller.get("shop_name", ""),
        "city": seller.get("city", ""),
        "address": seller.get("address", ""),
        "latitude": seller.get("latitude", 0),
        "longitude": seller.get("longitude", 0),
        "approval_status": seller.get("approval_status", "PENDING"),
        "bank_info": seller.get("bank_info", ""),
        "categories": seller.get("categories", []),
        "total_orders_fulfilled": total_orders,
        "created_at": seller.get("created_at", ""),
    }


import os


class SellerRegisterRequest(BaseModel):
    shop_name: str
    city: str
    address: str
    latitude: float
    longitude: float
    bank_account: str = ""
    bank_ifsc: str = ""
    bank_name: str = ""
    categories: list = []


from pydantic import BaseModel as PydanticBaseModel


@router.post("/register")
async def register_seller(req: SellerRegisterRequest, user=Depends(require_role("SELLER"))):
    seller_id = user["user_id"]
    seller = await db.users.find_one({"id": seller_id}, {"_id": 0})
    if seller and seller.get("shop_name"):
        return {"success": True, "message": "Already registered", "redirect": "/seller/approval-status"}

    bank_info = f"{req.bank_name} | {req.bank_account} | {req.bank_ifsc}" if req.bank_account else ""

    await db.users.update_one(
        {"id": seller_id},
        {"$set": {
            "shop_name": req.shop_name,
            "city": req.city,
            "address": req.address,
            "latitude": req.latitude,
            "longitude": req.longitude,
            "bank_info": bank_info,
            "categories": req.categories,
        }}
    )

    await db.audit_logs.insert_one({
        "id": gen_id(),
        "actor_id": seller_id,
        "actor_role": "SELLER",
        "action": "SELLER_REGISTERED",
        "entity": "user",
        "entity_id": seller_id,
        "details": f"Seller {req.shop_name} submitted registration",
        "created_at": now_iso(),
    })

    return {"success": True, "redirect": "/seller/approval-status"}
