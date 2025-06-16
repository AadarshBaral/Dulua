from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./databasef.db"
    GMAIL_APP_PASSWORD: str
    EMAIL: str
    APP_SECRET: str

    class Config:
        env_file = ".env"


settings = Settings()
