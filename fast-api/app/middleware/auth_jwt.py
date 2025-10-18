# https://chatgpt.com/c/68f405df-6348-8322-9f55-6a43189562dc

# app/middleware/auth_jwt.py
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import verify_token
from app.core.database import get_db
from app.models.user import User

bearer_scheme = HTTPBearer()  # Optional if you want to use Authorization: Bearer <token>

async def verify_jwt(request: Request, db: AsyncSession = Depends(get_db)):
    # 1️⃣ Get the access token from header
    access_token = request.headers.get("RequestVerification_AccessToken")
    if not access_token:
        raise HTTPException(status_code=401, detail="Access token missing")
    
    # 2️⃣ Verify JWT
    payload = verify_token(access_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user_id = payload.get("_id") or payload.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token payload invalid")
    
    # 3️⃣ Fetch user from DB
    user = await db.execute(
        User.__table__.select().where(User.id == user_id)
    )
    user_obj = user.scalar_one_or_none()
    if not user_obj:
        raise HTTPException(status_code=401, detail="User not found")
    
    # 4️⃣ Attach user to request state
    request.state.user = user_obj
    return user_obj  # Optional, you can also just use request.state.user in route
