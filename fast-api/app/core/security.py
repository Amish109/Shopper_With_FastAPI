from datetime import datetime, timedelta
from jose import jwt, JWTError
from app.core.config import settings

# Secret key (in .env)
SECRET_KEY = settings.SECRET_KEY
ALGORITHM =settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_DAYS = 10   # 15 minutes for access token
# ACCESS_TOKEN_EXPIRE_MINUTES = 10   # 15 minutes for access token
REFRESH_TOKEN_EXPIRE_DAYS = 30      # 7 days for refresh token

def create_access_token(data: dict):
    to_encode = data.copy()
    # expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_DAYS)
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # return decoded data
    except JWTError:
        return None
