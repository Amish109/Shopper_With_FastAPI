from pydantic import BaseModel, EmailStr

class UserSignUp(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserSignIn(BaseModel):
    username: str
    password: str
