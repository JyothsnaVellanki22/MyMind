from sqlalchemy import Boolean, Column, Integer, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    journals = relationship("Journal", back_populates="owner")
    visions = relationship("Vision", back_populates="owner")
    todos = relationship("Todo", back_populates="owner")

class Journal(Base):
    __tablename__ = "journals"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    ai_summary = Column(Text) # New column
    mood = Column(String)
    tags = Column(String)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="journals")

class Vision(Base):
    __tablename__ = "visions"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    category = Column(String)
    target_date = Column(DateTime)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="visions")

class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    completed = Column(Boolean, default=False)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="todos")
