from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db import get_connection
from app.core.security import verify_password, create_access_token

router = APIRouter()


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(data: LoginRequest):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT user_id, email, password_hash, role, is_active
        FROM app_user
        WHERE email = %s
        """,
        (data.email,)
    )

    user = cur.fetchone()

    cur.close()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_id, email, password_hash, role, is_active = user

    if not is_active:
        raise HTTPException(status_code=403, detail="User is deactivated")

    if not verify_password(data.password, password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        data={
            "user_id": user_id,
            "email": email,
            "role": role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "user_id": user_id,
            "email": email,
            "role": role
        }
    }
