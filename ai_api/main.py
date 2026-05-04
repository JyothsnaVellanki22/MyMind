from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from typing import List, Optional
import os
import json
from dotenv import load_dotenv
import sys
sys.path.append(os.path.dirname(__file__))

load_dotenv()

app = FastAPI(title="AI Service for Journal")

# Configure CORS properly for production - Forced Open
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

def verify_ai_token(token: str = Depends(lambda x: os.environ.get("AI_SERVICE_TOKEN", "dev-token"))):
    # This is a simple protection to prevent public misuse of your Gemini API Key
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
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not set.")
        
    try:
        client = genai.Client(api_key=api_key)
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
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
        data = json.loads(response.text)
        return AnalyzeResponse(
            mood=data.get("mood", "Neutral"),
            tags=data.get("tags", ""),
            summary=data.get("summary", ""),
            next_action=data.get("next_action", "")
        )
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        # Return fallback data instead of crashing
        return AnalyzeResponse(
            mood="Neutral",
            tags="general",
            summary="Reflection captured.",
            next_action="Continue reflecting."
        )

@app.post("/chat", dependencies=[Depends(get_token_header)])
def chat_with_journal(req: ChatRequest):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not set.")
        
    try:
        client = genai.Client(api_key=api_key)
        
        system_instruction = "You are a helpful, empathetic, and insightful journaling coach and therapist. Help the user reflect on their thoughts."
        if req.journal_context:
            system_instruction += f"\n\nHere are some of the user's recent journal entries for context:\n{req.journal_context}"
            
        formatted_history = []
        for msg in req.history:
            formatted_history.append(types.Content(
                role=msg.role,
                parts=[types.Part.from_text(text=msg.content)]
            ))
            
        contents = formatted_history + [types.Content(role="user", parts=[types.Part.from_text(text=req.message)])]
        
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
            )
        )
        
        return {"response": response.text}
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        raise HTTPException(status_code=500, detail=str(e))
