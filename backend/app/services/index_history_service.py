from __future__ import annotations

from typing import Sequence

import pandas as pd

from app.models.index_history import IndexHistory
from app.repositories.index_history_repository import IndexHistoryRepository


class IndexHistoryService:
    def __init__(self, db):
        self.repository = IndexHistoryRepository(db)

    def get_all(self, index_name: str) -> Sequence[IndexHistory]:
        return self.repository.get_all(index_name)

    def get_latest(self, index_name: str) -> IndexHistory | None:
        return self.repository.get_latest(index_name)

    def get_stats(self, index_name: str) -> dict:
        records = self.get_all(index_name)
        if not records:
            raise ValueError("No data available")

        df = pd.DataFrame([r.__dict__ for r in records]).drop(columns=["_sa_instance_state"], errors="ignore")
        df.sort_values("date", inplace=True)
        latest = df.iloc[-1]
        high_52 = df["high"].max()
        low_52 = df["low"].min()
        avg_close = float(df["close"].mean())
        highest_volume = int(df["volume"].max())
        lowest_volume = int(df["volume"].min())
        positive_days = int((df["daily_change_percent"] > 0).sum())
        negative_days = int((df["daily_change_percent"] < 0).sum())
        moving_average_7 = float(df["close"].rolling(7).mean().iloc[-1]) if len(df) >= 7 else None
        moving_average_30 = float(df["close"].rolling(30).mean().iloc[-1]) if len(df) >= 30 else None

        return {
            "index_name": index_name,
            "current_price": float(latest["close"]),
            "fifty_two_week_high": float(high_52),
            "fifty_two_week_low": float(low_52),
            "avg_close": avg_close,
            "highest_volume": highest_volume,
            "lowest_volume": lowest_volume,
            "trading_days": int(len(df)),
            "positive_days": positive_days,
            "negative_days": negative_days,
            "moving_average_7": moving_average_7,
            "moving_average_30": moving_average_30,
        }

    def build_dashboard_summary(self) -> list[dict]:
        summary = []
        for index_name in ("NIFTY50", "SENSEX"):
            data = self.get_all(index_name)
            if not data:
                continue
            df = pd.DataFrame([r.__dict__ for r in data]).drop(columns=["_sa_instance_state"], errors="ignore")
            df.sort_values("date", inplace=True)
            latest = df.iloc[-1]
            prev = df.iloc[-2] if len(df) >= 2 else latest
            todays_change = float(latest["close"] - prev["close"])
            todays_change_percent = float((todays_change / prev["close"]) * 100) if prev["close"] else 0.0
            summary.append(
                {
                    "index_name": index_name,
                    "current_price": float(latest["close"]),
                    "todays_change": todays_change,
                    "todays_change_percent": todays_change_percent,
                    "fifty_two_week_high": float(df["high"].max()),
                    "fifty_two_week_low": float(df["low"].min()),
                    "chart": [
                        {
                            "time": int(pd.Timestamp(row["date"]).timestamp()),
                            "open": float(row["open"]),
                            "high": float(row["high"]),
                            "low": float(row["low"]),
                            "close": float(row["close"]),
                            "volume": int(row["volume"]),
                        }
                        for _, row in df.tail(30).iterrows()
                    ],
                }
            )
        return summary

    def build_chart_data(self, index_name: str) -> list[dict]:
        data = self.get_all(index_name)
        if not data:
            return []
        df = pd.DataFrame([r.__dict__ for r in data]).drop(columns=["_sa_instance_state"], errors="ignore")
        df.sort_values("date", inplace=True)
        return [
            {
                "time": int(pd.Timestamp(row["date"]).timestamp()),
                "open": float(row["open"]),
                "high": float(row["high"]),
                "low": float(row["low"]),
                "close": float(row["close"]),
                "volume": int(row["volume"]),
            }
            for _, row in df.iterrows()
        ]

    def upsert_records(self, rows: list[dict]) -> None:
        records_to_add: list[IndexHistory] = []
        for row in rows:
            if self.repository.exists(row["index_name"], row["date"]):
                continue
            records_to_add.append(
                IndexHistory(
                    index_name=row["index_name"],
                    date=row["date"],
                    open=row["open"],
                    high=row["high"],
                    low=row["low"],
                    close=row["close"],
                    adj_close=row["adj_close"],
                    volume=row["volume"],
                    daily_change=row["daily_change"],
                    daily_change_percent=row["daily_change_percent"],
                )
            )
        if records_to_add:
            self.repository.add_many(records_to_add)
