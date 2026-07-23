from datetime import date
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.index_history import IndexHistory


class IndexHistoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, index_name: str) -> Sequence[IndexHistory]:
        return self.db.execute(select(IndexHistory).where(IndexHistory.index_name == index_name).order_by(IndexHistory.date.asc())).scalars().all()

    def get_latest(self, index_name: str) -> IndexHistory | None:
        return self.db.execute(
            select(IndexHistory).where(IndexHistory.index_name == index_name).order_by(IndexHistory.date.desc())
        ).scalars().first()

    def get_by_date(self, index_name: str, dt: date) -> IndexHistory | None:
        return self.db.execute(
            select(IndexHistory).where(IndexHistory.index_name == index_name, IndexHistory.date == dt)
        ).scalars().first()

    def add_many(self, records: list[IndexHistory]) -> None:
        self.db.add_all(records)
        self.db.commit()

    def exists(self, index_name: str, dt: date) -> bool:
        return self.db.execute(
            select(IndexHistory.id).where(IndexHistory.index_name == index_name, IndexHistory.date == dt)
        ).scalar_one_or_none() is not None

    def create(self, record: IndexHistory) -> None:
        self.db.add(record)
        self.db.commit()
