from fastapi import APIRouter, HTTPException, Depends
from middleware import require_role
from models import LocationRequest, CheckoutRequest, gen_id, now_iso
import random
import os
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/customer", tags=["customer"])

db = None


def set_db(database):
    global db
    db = database


@router.post("/location")
async def set_location(req: LocationRequest, user=Depends(require_role("CUSTOMER"))):
    await db.users.update_one(
        {"id": user["user_id"]},
        {"$set": {
            "latitude": req.latitude,
            "longitude": req.longitude,
            "address": req.address,
            "city": req.city,
            "house": req.house,
            "area": req.area,
            "pincode": req.pincode,
            "location_set": True,
        }}
    )
    return {"success": True, "redirect": "/customer/home"}


@router.get("/products")
async def get_products(user=Depends(require_role("CUSTOMER"))):
    customer = await db.users.find_one({"id": user["user_id"]}, {"_id": 0})
    if not customer or not customer.get("location_set"):
        raise HTTPException(status_code=400, detail="Location not set")

    products = await db.products.find(
        {"status": "APPROVED"}, {"_id": 0}
    ).to_list(1000)

    customer_products = []
    seen = {}
    for p in products:
        key = f"{p['name']}_{p['unit']}"
        if key not in seen:
            available = p.get("stock", 0) > 0
            customer_products.append({
                "id": p["id"],
                "name": p["name"],
                "unit": p["unit"],
                "price": p["seller_price"],
                "available": available,
                "category": p.get("category", "General"),
            })
            seen[key] = True

    return {"products": customer_products}


@router.post("/cart/checkout")
async def checkout(req: CheckoutRequest, user=Depends(require_role("CUSTOMER"))):
    customer = await db.users.find_one({"id": user["user_id"]}, {"_id": 0})
    if not customer or not customer.get("location_set"):
        raise HTTPException(status_code=400, detail="Location not set")

    order_items = []
    total_amount = 0

    for cart_item in req.items:
        product = await db.products.find_one(
            {"id": cart_item.product_id, "status": "APPROVED"}, {"_id": 0}
        )
        if not product:
            raise HTTPException(status_code=400, detail=f"Product {cart_item.product_id} not available")
        if product.get("stock", 0) < cart_item.quantity:
            raise HTTPException(status_code=400, detail=f"{product['name']} is out of stock")

        item_total = product["seller_price"] * cart_item.quantity
        order_items.append({
            "product_id": product["id"],
            "name": product["name"],
            "unit": product["unit"],
            "quantity": cart_item.quantity,
            "price": product["seller_price"],
            "total": item_total,
        })
        total_amount += item_total

    delivery_fee = 0 if total_amount >= 500 else 40

    # Find best seller - has all items in stock, approved, same city
    assigned_seller = None
    seller_ids = set()
    for item in order_items:
        product = await db.products.find_one({"id": item["product_id"]}, {"_id": 0})
        if product:
            seller_ids.add(product["seller_id"])

    for seller_id in seller_ids:
        seller = await db.users.find_one({
            "id": seller_id,
            "role": "SELLER",
            "approval_status": "APPROVED",
            "status": "ACTIVE",
        }, {"_id": 0})

        if not seller:
            continue

        today = now_iso()[:10]
        if seller.get("daily_stock_date", "") != today:
            continue

        has_all = True
        for item in order_items:
            prod = await db.products.find_one({
                "id": item["product_id"],
                "seller_id": seller_id,
                "status": "APPROVED",
            }, {"_id": 0})
            if not prod or prod.get("stock", 0) < item["quantity"]:
                has_all = False
                break

        if has_all:
            assigned_seller = seller
            break

    order_num = random.randint(1000, 9999)
    order_id = f"ORD-{order_num}"

    order = {
        "id": order_id,
        "customer_id": user["user_id"],
        "seller_id": assigned_seller["id"] if assigned_seller else "",
        "delivery_partner_id": "",
        "items": order_items,
        "status": "ASSIGNED" if assigned_seller else "CREATED",
        "delivery_address": req.delivery_address,
        "delivery_otp": "",
        "total_amount": total_amount + delivery_fee,
        "delivery_fee": delivery_fee,
        "payment_method": "COD",
        "created_at": now_iso(),
        "updated_at": now_iso(),
    }

    await db.orders.insert_one({**order})

    await db.audit_logs.insert_one({
        "id": gen_id(),
        "actor_id": user["user_id"],
        "actor_role": "CUSTOMER",
        "action": "ORDER_CREATED",
        "entity": "order",
        "entity_id": order_id,
        "details": f"Order {order_id} created with {len(order_items)} items, total ₹{total_amount + delivery_fee}",
        "created_at": now_iso(),
    })

    if not assigned_seller:
        return {"success": True, "order": order, "message": "Order created but no seller available currently"}

    return {"success": True, "order": order}


@router.get("/orders")
async def get_orders(user=Depends(require_role("CUSTOMER"))):
    orders = await db.orders.find(
        {"customer_id": user["user_id"]}, {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return {"orders": orders}


@router.get("/orders/{order_id}")
async def get_order(order_id: str, user=Depends(require_role("CUSTOMER"))):
    order = await db.orders.find_one(
        {"id": order_id, "customer_id": user["user_id"]}, {"_id": 0}
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"order": order}


@router.get("/profile")
async def get_profile(user=Depends(require_role("CUSTOMER"))):
    customer = await db.users.find_one({"id": user["user_id"]}, {"_id": 0})
    if not customer:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "phone": customer["phone"],
        "city": customer.get("city", ""),
        "address": customer.get("address", ""),
        "house": customer.get("house", ""),
        "area": customer.get("area", ""),
        "pincode": customer.get("pincode", ""),
        "location_set": customer.get("location_set", False),
    }
