from pydantic_settings import BaseSettings
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent  # one level up from app/
ENV_PATH = BASE_DIR / ".env"

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY : str
    ALGORITHM : str

    class Config:
        # env_file = ".env"
        env_file = str(ENV_PATH)
        env_file_encoding = "utf-8"

settings = Settings()
