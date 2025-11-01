from fastapi import APIRouter, Depends
from typing import Dict, Any
from datetime import datetime, timedelta
from ...schemas.billing import Subscription, BillingInfo, PlanType, PaymentStatus
from ...core.security import get_current_user

router = APIRouter(prefix="/user", tags=["User"])


mock_user_settings = {}
mock_subscriptions = {}


@router.get("/settings", response_model=Dict[str, Any])
async def get_user_settings(current_user: dict = Depends(get_current_user)):
    """
    Get user settings and preferences.
    
    TODO: Store in database
    TODO: Add notification preferences
    TODO: Include trading strategy defaults
    """
    
    user_id = current_user["user_id"]
    
    if user_id not in mock_user_settings:
        mock_user_settings[user_id] = {
            "notifications": {
                "email": True,
                "push": True,
                "signal_alerts": True
            },
            "trading": {
                "default_strategy": "Trend Following",
                "default_timeframe": "1h",
                "risk_level": "moderate"
            },
            "display": {
                "theme": "dark",
                "currency": "USD",
                "timezone": "UTC"
            }
        }
    
    return mock_user_settings[user_id]


@router.put("/settings", response_model=Dict[str, Any])
async def update_user_settings(
    settings: Dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    """
    Update user settings.
    
    TODO: Validate settings schema
    TODO: Store in database
    """
    
    user_id = current_user["user_id"]
    mock_user_settings[user_id] = settings
    
    return settings


@router.get("/subscription", response_model=Subscription)
async def get_subscription(current_user: dict = Depends(get_current_user)):
    """
    Get user's current subscription information.
    
    TODO: Fetch from database
    TODO: Integrate with payment provider (Stripe/Cashfree)
    TODO: Add usage tracking and limits
    """
    
    user_id = current_user["user_id"]
    
    if user_id not in mock_subscriptions:
        mock_subscriptions[user_id] = Subscription(
            id=f"sub_{user_id}",
            user_id=user_id,
            plan_type=PlanType.FREE,
            status=PaymentStatus.ACTIVE,
            current_period_start=datetime.now(),
            current_period_end=datetime.now() + timedelta(days=30),
            cancel_at_period_end=False
        )
    
    return mock_subscriptions[user_id]


@router.get("/billing", response_model=BillingInfo)
async def get_billing_info(current_user: dict = Depends(get_current_user)):
    """
    Get billing information including subscription and payment methods.
    
    TODO: Integrate with payment provider
    TODO: Add invoice history
    TODO: Include usage metrics
    """
    
    user_id = current_user["user_id"]
    
    subscription = mock_subscriptions.get(user_id)
    if not subscription:
        subscription = Subscription(
            id=f"sub_{user_id}",
            user_id=user_id,
            plan_type=PlanType.FREE,
            status=PaymentStatus.ACTIVE,
            current_period_start=datetime.now(),
            current_period_end=datetime.now() + timedelta(days=30),
            cancel_at_period_end=False
        )
    
    return BillingInfo(
        subscription=subscription,
        payment_method=None,
        usage={
            "analyses_this_month": 25,
            "limit": 100,
            "signals_accessed": 150
        }
    )
