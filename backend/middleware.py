from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os

security = HTTPBearer()

JWT_SECRET = os.environ.get("JWT_SECRET", "green_basket_secret_key_v1")
JWT_ALGORITHM = "HS256"


def create_token(user_id: str, role: str, city: str, status: str, phone: str):
    payload = {
        "user_id": user_id,
        "role": role,
        "city": city,
        "status": status,
        "phone": phone,
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(credentials.credentials)
    if payload.get("status") == "SUSPENDED":
        raise HTTPException(status_code=403, detail="Account suspended")
    return payload


def require_role(required_role: str):
    async def role_checker(user=Depends(get_current_user)):
        if user.get("role") != required_role:
            raise HTTPException(status_code=403, detail=f"Access denied. Required role: {required_role}")
        return user
    return role_checker
