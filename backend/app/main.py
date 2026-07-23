from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.index_history import router as index_router
from app.database.base import Base
from app.database.session import engine
from app.models.index_history import IndexHistory  # noqa: F401

app = FastAPI(title="Indian Market Analytics Dashboard")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(index_router)


@app.get("/")
def root():
    return {"message": "Indian Market Analytics Dashboard API is running"}
