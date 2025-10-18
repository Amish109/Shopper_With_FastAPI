# from fastapi.responses import JSONResponse
# return JSONResponse({"success": True, "message": f"User {user.username} logged out successfully"})

# app/controllers/user_controller.py
# https://chatgpt.com/c/68f402ba-8d48-8320-a582-09b6d8b50926

from fastapi import Depends, Response, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext
from app.core.database import get_db
from app.models.user import User
from app.schemas.user_schema import UserSignUp, UserSignIn
from app.utils import SuccessResponse, ErrorResponse
from app.core.security import create_access_token, create_refresh_token, verify_token

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ----------------- SIGN UP -----------------
async def sign_up(user: UserSignUp, db: AsyncSession = Depends(get_db)):
    if not user.username or not user.email or not user.password:
        return ErrorResponse(message="Please make sure all fields are filled")

    # Check if user exists
    result = await db.execute(
        select(User).where((User.username == user.username) | (User.email == user.email))
    )
    existing_user = result.scalars().first()
    if existing_user:
        return ErrorResponse(message="User with this username or email already exists")

    # Hash password
    hashed_password = pwd_context.hash(user.password)

    # Create user
    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return SuccessResponse(
        message=f"User {user.username} registered successfully",
        data={"id": new_user.id}
    )


# ----------------- SIGN IN -----------------
async def sign_in(response: Response, user: UserSignIn, db: AsyncSession = Depends(get_db)):
    # Check user exists
    result = await db.execute(select(User).where(User.username == user.username))
    db_user = result.scalars().first()
    if not db_user:
        return ErrorResponse(message="Invalid username or password")

    # Verify password
    if not pwd_context.verify(user.password, db_user.password):
        return ErrorResponse(message="Invalid username or password")

    # Create JWT tokens
    access_token = create_access_token({"user_id": db_user.id})
    refresh_token = create_refresh_token({"user_id": db_user.id})

    # Set cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=10 * 24 * 3600,  # 10 days in seconds
        samesite="lax"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=30 * 24 * 3600,  # 30 days
        samesite="lax"
    )

    return SuccessResponse(message="Sign in successful")


# ----------------- SIGN OUT -----------------
async def sign_out(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return SuccessResponse(message="Signed out successfully")

async def sign_out(request: Request,response: Response):
    # user = request.state.user 
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return SuccessResponse(message="Signed out successfully")
    # from fastapi.responses import JSONResponse
    # return JSONResponse({"success": True, "message": f"User {user.username} logged out successfully"})

# ----------------- CHECK COOKIE / AUTH STATUS -----------------
async def check_cookie(request: Request):
    access_token = request.cookies.get("access_token")
    refresh_token = request.cookies.get("refresh_token")

    if not access_token:
        return {"loggedIn": False}

    payload = verify_token(access_token)
    if not payload:
        return {"loggedIn": False}

    return {"loggedIn": True, "user_id": payload.get("user_id")}
