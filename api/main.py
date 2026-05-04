from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import sys
import os
import jwt
sys.path.append(os.path.dirname(__file__))
import models, schemas, auth, database
from datetime import timedelta
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="AI Thought Journal API")

# Configure CORS properly for production
raw_origins = os.environ.get("ALLOWED_ORIGINS", "*").split(",")
allowed_origins = [origin.strip().rstrip("/") for origin in raw_origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Main API is running", "docs": "/docs"}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except Exception:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/auth/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    print(f"DEBUG: Registering user {user.email}")
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        print(f"DEBUG: Email {user.email} already exists")
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    print(f"DEBUG: Successfully registered {user.email}")
    return db_user

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    print(f"DEBUG: Login attempt for {form_data.username}")
    try:
        user = db.query(models.User).filter(models.User.email == form_data.username).first()
        if not user or not auth.verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth.create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(f"LOGIN ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.get("/auth/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.post("/journals", response_model=schemas.Journal)
def create_journal(journal: schemas.JournalCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_journal = models.Journal(**journal.model_dump(), owner_id=current_user.id)
    db.add(db_journal)
    db.commit()
    db.refresh(db_journal)
    return db_journal

@app.get("/journals", response_model=list[schemas.Journal])
def read_journals(
    search: str = None, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.Journal).filter(models.Journal.owner_id == current_user.id)
    if search:
        query = query.filter(
            (models.Journal.title.ilike(f"%{search}%")) | 
            (models.Journal.content.ilike(f"%{search}%")) |
            (models.Journal.tags.ilike(f"%{search}%"))
        )
    journals = query.order_by(models.Journal.date.desc()).offset(skip).limit(limit).all()
    return journals
@app.get("/journals/{journal_id}", response_model=schemas.Journal)
def read_journal(journal_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_journal = db.query(models.Journal).filter(models.Journal.id == journal_id, models.Journal.owner_id == current_user.id).first()
    if db_journal is None:
        raise HTTPException(status_code=404, detail="Journal not found")
    return db_journal

@app.put("/journals/{journal_id}", response_model=schemas.Journal)
def update_journal(journal_id: int, journal: schemas.JournalCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_journal = db.query(models.Journal).filter(models.Journal.id == journal_id, models.Journal.owner_id == current_user.id).first()
    if db_journal is None:
        raise HTTPException(status_code=404, detail="Journal not found")
    for key, value in journal.model_dump().items():
        setattr(db_journal, key, value)
    db.commit()
    db.refresh(db_journal)
    return db_journal

@app.delete("/journals/{journal_id}")
def delete_journal(journal_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_journal = db.query(models.Journal).filter(models.Journal.id == journal_id, models.Journal.owner_id == current_user.id).first()
    if db_journal is None:
        raise HTTPException(status_code=404, detail="Journal not found")
    db.delete(db_journal)
    db.commit()
    return {"ok": True}

@app.post("/visions", response_model=schemas.Vision)
def create_vision(vision: schemas.VisionCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_vision = models.Vision(**vision.model_dump(), owner_id=current_user.id)
    db.add(db_vision)
    db.commit()
    db.refresh(db_vision)
    return db_vision

@app.put("/visions/{vision_id}", response_model=schemas.Vision)
def update_vision(vision_id: int, vision: schemas.VisionUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_vision = db.query(models.Vision).filter(models.Vision.id == vision_id, models.Vision.owner_id == current_user.id).first()
    if db_vision is None:
        raise HTTPException(status_code=404, detail="Vision not found")
    db_vision.completed = vision.completed
    db.commit()
    db.refresh(db_vision)
    return db_vision

@app.get("/visions", response_model=list[schemas.Vision])
def read_visions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    visions = db.query(models.Vision).filter(models.Vision.owner_id == current_user.id).offset(skip).limit(limit).all()
    return visions

@app.delete("/visions/{vision_id}")
def delete_vision(vision_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_vision = db.query(models.Vision).filter(models.Vision.id == vision_id, models.Vision.owner_id == current_user.id).first()
    if db_vision is None:
        raise HTTPException(status_code=404, detail="Vision not found")
    db.delete(db_vision)
    db.commit()
    return {"ok": True}

@app.post("/todos", response_model=schemas.Todo)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_todo = models.Todo(**todo.model_dump(), owner_id=current_user.id)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.get("/todos", response_model=list[schemas.Todo])
def read_todos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    todos = db.query(models.Todo).filter(models.Todo.owner_id == current_user.id).order_by(models.Todo.date.desc()).offset(skip).limit(limit).all()
    return todos

@app.put("/todos/{todo_id}", response_model=schemas.Todo)
def update_todo(todo_id: int, todo: schemas.TodoUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id, models.Todo.owner_id == current_user.id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    db_todo.completed = todo.completed
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id, models.Todo.owner_id == current_user.id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(db_todo)
    db.commit()
    return {"ok": True}
