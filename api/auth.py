import jwt
from datetime import datetime, timedelta
from typing import Optional
import hashlib
import base64
import secrets
import os

def ab64_decode(s: str) -> bytes:
    standard_b64 = s.replace(".", "+")
    padding = "=" * (4 - len(standard_b64) % 4) if len(standard_b64) % 4 != 0 else ""
    return base64.b64decode(standard_b64 + padding)

def ab64_encode(data: bytes) -> str:
    standard_b64 = base64.b64encode(data).decode("utf-8")
    return standard_b64.replace("+", ".").rstrip("=")

SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    SECRET_KEY = "insecure-fallback-key-replace-this-now"
    
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if not hashed_password.startswith("$pbkdf2-sha256$"):
            return False
        parts = hashed_password.split("$")
        if len(parts) != 5:
            return False
        iterations = int(parts[2])
        salt_b64 = parts[3]
        hash_b64 = parts[4]
        
        salt = ab64_decode(salt_b64)
        expected_hash = ab64_decode(hash_b64)
        
        actual_hash = hashlib.pbkdf2_hmac(
            "sha256",
            plain_password.encode("utf-8"),
            salt,
            iterations
        )
        return secrets.compare_digest(actual_hash, expected_hash)
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    salt = secrets.token_bytes(16)
    iterations = 29000
    hash_bytes = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        iterations
    )
    salt_b64 = ab64_encode(salt)
    hash_b64 = ab64_encode(hash_bytes)
    return f"$pbkdf2-sha256${iterations}${salt_b64}${hash_b64}"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire.timestamp()}) # PyJWT often prefers timestamps
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception:
        return None
