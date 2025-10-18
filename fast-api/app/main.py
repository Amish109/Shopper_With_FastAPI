# main.py
from fastapi import FastAPI
from app.core.database import Base, engine
from app.routes import user_router

app = FastAPI(title="FastAPI + PostgreSQL Starter")

# Use startup event instead of asyncio.run()
@app.on_event("startup")
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Include your routes
app.include_router(user_router.router)

@app.get("/")
def root():
    return {"message": "Welcome to FastAPI PostgreSQL App!"}


# from fastapi import FastAPI
# from app.core.database import Base, engine
# from app.routes import user_routes

# # Create database tables
# Base.metadata.create_all(bind=engine)

# app = FastAPI(title="FastAPI + PostgreSQL Starter")

# # Register routes
# app.include_router(user_routes.router)

# @app.get("/")
# def root():
#     return {"message": "Welcome to FastAPI PostgreSQL App!"}
