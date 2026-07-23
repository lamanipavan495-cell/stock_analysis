from datetime import datetime

from sqlalchemy import BigInteger, Date, DateTime, Double, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class IndexHistory(Base):
    __tablename__ = "index_history"
    __table_args__ = (UniqueConstraint("index_name", "date", name="uq_index_date"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    index_name: Mapped[str] = mapped_column(String(20), nullable=False)
    date: Mapped[Date] = mapped_column(Date, nullable=False)
    open: Mapped[float] = mapped_column(Double, nullable=False)
    high: Mapped[float] = mapped_column(Double, nullable=False)
    low: Mapped[float] = mapped_column(Double, nullable=False)
    close: Mapped[float] = mapped_column(Double, nullable=False)
    adj_close: Mapped[float] = mapped_column(Double, nullable=False)
    volume: Mapped[int] = mapped_column(BigInteger, nullable=False)
    daily_change: Mapped[float | None] = mapped_column(Double, nullable=True)
    daily_change_percent: Mapped[float | None] = mapped_column(Double, nullable=True)
    created_at: Mapped[datetime | None] = mapped_column(DateTime, default=datetime.utcnow, nullable=True)
