from sqlmodel import SQLModel, create_engine, Session  # type: ignore
from app.config import settings

connect_args = {"check_same_thread": False}
engine = create_engine(settings.SQLALCHEMY_DATABASE_URI,
                       connect_args=connect_args)


def create_db_and_tables():
    print("createed dbs")
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
