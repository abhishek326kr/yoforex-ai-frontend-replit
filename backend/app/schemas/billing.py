from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class PlanType(str, Enum):
    FREE = "free"
    BASIC = "basic"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class PaymentStatus(str, Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    CANCELLED = "cancelled"
    PENDING = "pending"


class Plan(BaseModel):
    id: str
    name: str
    price: float
    currency: str = "USD"
    interval: str
    features: list[str]
    is_popular: bool = False


class Subscription(BaseModel):
    id: str
    user_id: str
    plan_type: PlanType
    status: PaymentStatus
    current_period_start: datetime
    current_period_end: datetime
    cancel_at_period_end: bool = False
    
    class Config:
        from_attributes = True


class PaymentMethod(BaseModel):
    id: str
    type: str
    last4: Optional[str] = None
    brand: Optional[str] = None
    exp_month: Optional[int] = None
    exp_year: Optional[int] = None


class BillingInfo(BaseModel):
    subscription: Optional[Subscription] = None
    payment_method: Optional[PaymentMethod] = None
    usage: dict = {}
