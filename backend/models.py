from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, timezone
import uuid


def gen_id():
    return str(uuid.uuid4())


def now_iso():
    return datetime.now(timezone.utc).isoformat()


# --- Auth ---
class SendOTPRequest(BaseModel):
    phone: str

class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str
    role: str  # CUSTOMER, SELLER, DELIVERY, ADMIN

class AuthResponse(BaseModel):
    token: str
    user: dict
    redirect: str

# --- Seller ---
class BulkProductItem(BaseModel):
    name: str
    unit: str
    price: float

class BulkProductRequest(BaseModel):
    products: List[BulkProductItem]

class PriceUpdateRequest(BaseModel):
    price: float

class StockConfirmItem(BaseModel):
    product_id: str
    stock: int

class StockConfirmRequest(BaseModel):
    items: List[StockConfirmItem]

class StockAdjustRequest(BaseModel):
    adjustment: int  # +1 or -1

# --- Customer ---
class LocationRequest(BaseModel):
    latitude: float
    longitude: float
    address: str
    city: str
    house: Optional[str] = ""
    area: Optional[str] = ""
    pincode: Optional[str] = ""

class CartItem(BaseModel):
    product_id: str
    quantity: int

class CheckoutRequest(BaseModel):
    items: List[CartItem]
    delivery_address: dict
    payment_method: str = "COD"

# --- Delivery ---
class AvailabilityRequest(BaseModel):
    is_available: bool

class DeliveryOTPRequest(BaseModel):
    otp: str

# --- Admin ---
class RejectRequest(BaseModel):
    reason: str

class SuspendRequest(BaseModel):
    reason: Optional[str] = ""
