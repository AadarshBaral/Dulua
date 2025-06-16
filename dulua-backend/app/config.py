from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./databasef.db"

    class Config:
        env_file = ".env"

settings = Settings()
