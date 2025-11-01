from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime
from ...schemas.user import UserCreate, UserLogin, UserResponse, Token, UserProfileUpdate
from ...core.security import create_access_token, get_password_hash, verify_password, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


mock_users_db = {}


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    """
    Register a new user account.
    
    TODO: Replace with real database (PostgreSQL/MongoDB)
    TODO: Add email verification
    TODO: Implement rate limiting
    """
    
    if user.email in mock_users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user_id = f"user_{len(mock_users_db) + 1}"
    hashed_password = get_password_hash(user.password)
    
    mock_users_db[user.email] = {
        "id": user_id,
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": hashed_password,
        "created_at": datetime.now(),
        "subscription_tier": "free"
    }
    
    access_token = create_access_token(data={"sub": user_id, "email": user.email})
    
    return Token(access_token=access_token)


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """
    Login with email and password to get JWT access token.
    
    TODO: Add login attempt tracking
    TODO: Implement account lockout after failed attempts
    TODO: Add refresh token support
    """
    
    user_data = mock_users_db.get(credentials.email)
    
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not verify_password(credentials.password, user_data["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(
        data={"sub": user_data["id"], "email": user_data["email"]}
    )
    
    return Token(access_token=access_token)


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    """
    Get current user profile (protected endpoint).
    
    TODO: Fetch from real database
    TODO: Include additional user preferences
    """
    
    for email, user_data in mock_users_db.items():
        if user_data["id"] == current_user["user_id"]:
            return UserResponse(
                id=user_data["id"],
                email=user_data["email"],
                full_name=user_data.get("full_name"),
                created_at=user_data["created_at"],
                subscription_tier=user_data.get("subscription_tier", "free")
            )
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found"
    )


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_update: UserProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update user profile information.
    
    TODO: Add validation for profile fields
    TODO: Store in real database
    """
    
    for email, user_data in mock_users_db.items():
        if user_data["id"] == current_user["user_id"]:
            if profile_update.full_name is not None:
                user_data["full_name"] = profile_update.full_name
            if profile_update.phone is not None:
                user_data["phone"] = profile_update.phone
            if profile_update.country is not None:
                user_data["country"] = profile_update.country
            
            return UserResponse(
                id=user_data["id"],
                email=user_data["email"],
                full_name=user_data.get("full_name"),
                created_at=user_data["created_at"],
                subscription_tier=user_data.get("subscription_tier", "free")
            )
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found"
    )
