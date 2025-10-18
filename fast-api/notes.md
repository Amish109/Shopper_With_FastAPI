## uvicorn main:app --reload <!-- https://chatgpt.com/c/68f40d6c-5720-8322-9ade-2f9ccb7403c4-->
<!-- uvicorn app.main:app --reload -->

<!--I] https://blog.stackademic.com/python-building-simple-api-with-fastapi-and-postgresql-d5ddd7d501b7 -->
<!--II] MVC setup -->
<!-- https://chatgpt.com/share/68f3e367-ee10-8003-a522-1e8114b43eef -->

<!-- III] __init__.py import and export
https://chatgpt.com/share/68f3f07d-d764-8003-9c3c-d238a4ef0c4a
 -->
<!-- IV] __init__.py import and export
https://chatgpt.com/share/68f3f07d-d764-8003-9c3c-d238a4ef0c4a
 -->

<!-- V] ErrorResponse and SuccessResponse
# https://chatgpt.com/share/68f3ef6b-7894-8003-af04-f1116ac2848f
https://chatgpt.com/c/68f3f222-2ce8-8321-939d-961ca3aa4541

Returing Exception on Error response as returing normal object wont raise an http exception
https://chatgpt.com/c/68f40c24-dc0c-8321-9977-b7ab010656e9
 -->
<!-- VI] CRUD using async db
https://chatgpt.com/c/68f3f87e-20e4-8322-8606-08ad405a6c92
 -->
<!-- VII] JWT TOKEN
https://chatgpt.com/share/68f3fec9-4f88-8003-8ff4-d13dc41a831c
 -->

 <!-- IX] Middleware
 https://chatgpt.com/c/68f405df-6348-8322-9f55-6a43189562dc
  -->
## pydantic is used for data validation

/*
from pydantic import BaseModel

class Product(BaseModel):
    id: int
    name: str
    price: float


    defines the structure of data — what fields exist and their data types
    When data is passed into it, Pydantic automatically validates and converts it.

------------------------------------------------
    from pydantic import BaseModel
    from typing import Optional
    class StockBase(BaseModel):
        ipoyear: Optional[int] = None
        volume: int

*/


## BaseSettings of pydantic
/*
BaseSettings is a Pydantic class designed to read configuration values from:

- Environment variables (os.environ)
- .env files (if specified in Config.env_file)
- Direct arguments when initializing the class


class Settings(BaseSettings):
    DATABASE_URL: str   # from env

    class Config:
        env_file = ".env"



*/