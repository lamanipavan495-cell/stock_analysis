from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


class IndexHistoryBase(BaseModel):
    index_name: str
    date: date
    open: float
    high: float
    low: float
    close: float
    adj_close: float
    volume: int
    daily_change: float | None = None
    daily_change_percent: float | None = None

    model_config = ConfigDict(from_attributes=True)


class IndexHistoryCreate(IndexHistoryBase):
    pass


class IndexHistoryRead(IndexHistoryBase):
    id: int
    created_at: datetime | None = None


class DashboardSummary(BaseModel):
    index_name: str
    current_price: float
    todays_change: float
    todays_change_percent: float
    fifty_two_week_high: float
    fifty_two_week_low: float
    chart: list[dict]


class StatsResponse(BaseModel):
    index_name: str
    current_price: float
    fifty_two_week_high: float
    fifty_two_week_low: float
    avg_close: float
    highest_volume: int
    lowest_volume: int
    trading_days: int
    positive_days: int
    negative_days: int
    moving_average_7: float | None = None
    moving_average_30: float | None = None


class ChartCandle(BaseModel):
    time: int
    open: float
    high: float
    low: float
    close: float
    volume: int
