from pydantic import BaseModel
from typing import List, Optional
import datetime

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str
    name: str

class User(UserBase):
    id: int
    name: str
    class Config:
        from_attributes = True

class JournalBase(BaseModel):
    title: str
    content: str
    mood: Optional[str] = None
    tags: Optional[str] = None
    ai_summary: Optional[str] = None

class JournalCreate(JournalBase):
    pass

class Journal(JournalBase):
    id: int
    date: datetime.datetime
    owner_id: int
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class VisionBase(BaseModel):
    title: str
    description: str
    category: str
    target_date: Optional[datetime.datetime] = None
    completed: bool = False

class VisionCreate(VisionBase):
    pass

class VisionUpdate(BaseModel):
    completed: bool

class Vision(VisionBase):
    id: int
    owner_id: int
    class Config:
        from_attributes = True

class TodoBase(BaseModel):
    content: str
    completed: bool = False

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    completed: bool

class Todo(TodoBase):
    id: int
    date: datetime.datetime
    owner_id: int
    class Config:
        from_attributes = True
