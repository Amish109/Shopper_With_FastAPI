from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Async DB URL (Postgres)
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

# Async engine
engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True)

# Async session factory
SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False
)

# Base model
Base = declarative_base()

# Dependency
async def get_db():
    async with SessionLocal() as db:
        yield db




# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base
# from app.core.config import settings

# SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

# engine = create_engine(SQLALCHEMY_DATABASE_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base = declarative_base()

# # Dependency for routes
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()
