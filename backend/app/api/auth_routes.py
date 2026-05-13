from fastapi import APIRouter
from app.schemas.user_schema import (
    RegisterSchema,
    LoginSchema
)
from app.services.auth_service import (
    register_user,
    login_user
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register")
async def register(data: RegisterSchema):
    return await register_user(data)

@router.post("/login")
async def login(data: LoginSchema):
    return await login_user(data)