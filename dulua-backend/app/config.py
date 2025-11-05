from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./databasef.db"
    GMAIL_APP_PASSWORD: str
    EMAIL: str
    APP_SECRET: str

    class Config:
        env_file = ".env"


settings = Settings()
# Base upload directory
UPLOAD_DIR = Path("uploads/reviews")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Subfolder for YOLO annotated trash images
TRASH_DIR = UPLOAD_DIR / "trash"
TRASH_DIR.mkdir(parents=True, exist_ok=True)
