import os
import httpx
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS so frontend can communicate smoothly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class ProjectRequest(BaseModel):
    project_idea: str

SYSTEM_PROMPT = """You are ProjectPilot AI, an elite Machine Learning Architect. 
For the given project idea, generate a comprehensive blueprint. 
Your response MUST cover these sections using clear Markdown headers (##):
1. AI Project Blueprint & Core Logic
2. Recommended Tech Stack
3. Curated Public Datasets
4. Step-by-Step Development Workflow
5. Folder Structure Layout
6. GitHub-Ready README.md Template
7. Interview Questions with Answers."""

async def generate_gemini_stream(prompt: str):
    # Using the universally active stable 'gemini-2.5-flash' model under v1 stable API
    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key={GEMINI_API_KEY}"
    
    payload = {
        "contents": [{
            "parts": [{"text": f"{SYSTEM_PROMPT}\n\nUser Project Idea: {prompt}"}]
        }]
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, timeout=45.0)
            if response.status_code != 200:
                yield f"Error: API returned status {response.status_code}\n{response.text}"
                return
            
            data = response.json()
            # Extract the complete generated text block
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            
            # Stream the text locally word-by-word smoothly
            for word in text.split(" "):
                yield word + " "
                await asyncio.sleep(0.01)
                
        except Exception as e:
            yield f"System Connection Error: {str(e)}"

@app.post("/api/generate-blueprint")
async def generate_blueprint(request: ProjectRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY missing in .env file")
    return StreamingResponse(generate_gemini_stream(request.project_idea), media_type="text/plain")

from fastapi.responses import FileResponse

# Agar koi seedha URL par aaye, toh index.html serve ho jaye
@app.get("/")
async def read_index():
    # Hum index.html ko direct access karenge
    # Iske liye hum is path ko point karenge
    frontend_path = os.path.join(os.path.dirname(__file__), "..", "Frontend", "index.html")
    return FileResponse(frontend_path)