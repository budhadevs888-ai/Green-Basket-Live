import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from models import gen_id, now_iso

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME", "green_basket")


async def seed_admin(db):
    existing = await db.users.find_one({"phone": "9999999999", "role": "ADMIN"})
    if not existing:
        admin = {
            "id": gen_id(),
            "phone": "9999999999",
            "role": "ADMIN",
            "status": "ACTIVE",
            "approval_status": "APPROVED",
            "city": "Bangalore",
            "latitude": 12.9716,
            "longitude": 77.5946,
            "address": "Admin Office",
            "house": "",
            "area": "",
            "pincode": "",
            "shop_name": "",
            "bank_info": "",
            "categories": [],
            "daily_stock_confirmed": False,
            "daily_stock_date": "",
            "is_available": False,
            "location_set": True,
            "created_at": now_iso(),
        }
        await db.users.insert_one(admin)
        logger.info("Admin seeded: phone=9999999999")
    else:
        logger.info("Admin already exists")


@asynccontextmanager
async def lifespan(app: FastAPI):
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    app.state.db = db

    # Create indexes
    await db.users.create_index([("phone", 1), ("role", 1)], unique=True)
    await db.users.create_index("id", unique=True)
    await db.products.create_index("id", unique=True)
    await db.products.create_index("seller_id")
    await db.orders.create_index("id", unique=True)
    await db.orders.create_index("customer_id")
    await db.orders.create_index("seller_id")
    await db.orders.create_index("delivery_partner_id")
    await db.earnings.create_index("user_id")
    await db.audit_logs.create_index("created_at")

    # Seed admin
    await seed_admin(db)

    # Pass db to route modules
    from routes.auth import set_db as auth_set_db
    from routes.seller import set_db as seller_set_db
    from routes.customer import set_db as customer_set_db
    from routes.delivery import set_db as delivery_set_db
    from routes.admin import set_db as admin_set_db

    auth_set_db(db)
    seller_set_db(db)
    customer_set_db(db)
    delivery_set_db(db)
    admin_set_db(db)

    logger.info("Green Basket backend started")
    yield

    client.close()


app = FastAPI(title="Green Basket API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
from routes.auth import router as auth_router
from routes.seller import router as seller_router
from routes.customer import router as customer_router
from routes.delivery import router as delivery_router
from routes.admin import router as admin_router

app.include_router(auth_router)
app.include_router(seller_router)
app.include_router(customer_router)
app.include_router(delivery_router)
app.include_router(admin_router)


@app.get("/api/health")
async def health():
    return {"status": "healthy", "service": "Green Basket API"}
