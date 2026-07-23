from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import pandas as pd

from app.database.base import Base
from app.database.session import SessionLocal, engine
from app.services.index_history_service import IndexHistoryService

BASE_DIR = Path(__file__).resolve().parents[1]
CSV_MAP = {
    "NIFTY50": BASE_DIR / "data" / "nifty50.csv",
    "SENSEX": BASE_DIR / "data" / "sensex.csv",
}


def prepare_rows(index_name: str, frame: pd.DataFrame) -> list[dict]:
    frame = frame.copy()
    frame["Date"] = pd.to_datetime(frame["Date"]).dt.date
    frame = frame.sort_values("Date").reset_index(drop=True)
    frame["daily_change"] = frame["Close"].diff()
    frame["daily_change_percent"] = frame["Close"].pct_change() * 100
    rows = []
    for _, row in frame.iterrows():
        rows.append(
            {
                "index_name": index_name,
                "date": row["Date"],
                "open": float(row["Open"]),
                "high": float(row["High"]),
                "low": float(row["Low"]),
                "close": float(row["Close"]),
                "adj_close": float(row["Adj Close"]),
                "volume": int(row["Volume"]),
                "daily_change": float(row["daily_change"]) if pd.notna(row["daily_change"]) else None,
                "daily_change_percent": float(row["daily_change_percent"]) if pd.notna(row["daily_change_percent"]) else None,
            }
        )
    return rows


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        service = IndexHistoryService(db)
        for index_name, csv_path in CSV_MAP.items():
            df = pd.read_csv(csv_path)
            service.upsert_records(prepare_rows(index_name, df))
            print(f"Imported {index_name} rows from {csv_path.name}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
