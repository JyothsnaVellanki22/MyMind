from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from typing import List, Optional
import os
import json
from dotenv import load_dotenv
import sys
sys.path.append(os.path.dirname(__file__))

load_dotenv()

app = FastAPI(
    title="AI Service for Journal",
    root_path="/ai" if os.environ.get("VERCEL") else ""
)

# Configure CORS properly for production
allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "")
if allowed_origins_env:
    origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
else:
    origins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def verify_ai_token(token: str = Depends(lambda x: os.environ.get("AI_SERVICE_TOKEN", "dev-token"))):
    # This is a simple protection to prevent public misuse of your OpenRouter API Key
    pass

from fastapi import Header

async def get_token_header(x_ai_service_token: Optional[str] = Header(None)):
    expected_token = os.environ.get("AI_SERVICE_TOKEN", "dev-token")
    if x_ai_service_token != expected_token:
        raise HTTPException(status_code=401, detail="Invalid AI Service Token")
    return x_ai_service_token

@app.get("/")
def read_root():
    return {"status": "AI Service is running", "docs": "/docs"}

class AnalyzeRequest(BaseModel):
    title: str
    content: str

class AnalyzeResponse(BaseModel):
    mood: str
    tags: str
    summary: str
    next_action: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    history: List[ChatMessage]
    message: str
    journal_context: str = ""

@app.post("/analyze", response_model=AnalyzeResponse, dependencies=[Depends(get_token_header)])
def analyze_journal(req: AnalyzeRequest):
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY is not set.")
        
    try:
        prompt = f"""
        Analyze the following journal entry.
        Title: {req.title}
        Content: {req.content}
        
        Provide the output as a JSON object with exactly four string keys:
        - "mood": A single word describing the primary mood (e.g., Joyful, Anxious, Inspired, Sad, Reflective).
        - "tags": A comma-separated list of 2-4 relevant tags (e.g., work, family, health, dreams).
        - "summary": A very brief 1-sentence summary of the entry.
        - "next_action": A suggested small next action for the user based on their reflection (e.g., "Call your friend", "Take a 5-minute walk", "Write down one goal").
        
        Return ONLY valid JSON matching this schema.
        """
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "google/gemini-2.0-flash",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"}
        }
        
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        res_json = response.json()
        content = res_json["choices"][0]["message"]["content"]
        data = json.loads(content)
        return AnalyzeResponse(
            mood=data.get("mood", "Neutral"),
            tags=data.get("tags", ""),
            summary=data.get("summary", ""),
            next_action=data.get("next_action", "")
        )
    except Exception as e:
        print(f"Error calling OpenRouter: {e}")
        # Return fallback data instead of crashing
        return AnalyzeResponse(
            mood="Neutral",
            tags="general",
            summary="Reflection captured.",
            next_action="Continue reflecting."
        )

@app.post("/chat", dependencies=[Depends(get_token_header)])
def chat_with_journal(req: ChatRequest):
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY is not set.")
        
    try:
        system_instruction = "You are a helpful, empathetic, and insightful journaling coach and therapist. Help the user reflect on their thoughts."
        if req.journal_context:
            system_instruction += f"\n\nHere are some of the user's recent journal entries for context:\n{req.journal_context}"
            
        messages = [{"role": "system", "content": system_instruction}]
        for msg in req.history:
            role = "assistant" if msg.role in ["model", "assistant"] else "user"
            messages.append({"role": role, "content": msg.content})
            
        messages.append({"role": "user", "content": req.message})
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "google/gemini-2.0-flash",
            "messages": messages
        }
        
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        res_json = response.json()
        reply = res_json["choices"][0]["message"]["content"]
        return {"response": reply}
    except Exception as e:
        print(f"Error calling OpenRouter: {e}")
        raise HTTPException(status_code=500, detail=str(e))

