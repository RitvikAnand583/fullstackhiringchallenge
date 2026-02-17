from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.config import GEMINI_API_KEY
import google.generativeai as genai

router = APIRouter(prefix="/api/ai", tags=["ai"])


class AIRequest(BaseModel):
    text: str
    action: str  # "summary" or "grammar"


PROMPTS = {
    "summary": "Write a short summary of the following blog text. Return only the summary, nothing else.\n\nText:\n{text}",
    "grammar": "Fix the grammar and spelling in the following text. Return only the corrected text, nothing else.\n\nText:\n{text}",
}


@router.post("/generate")
async def generate(req: AIRequest):
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        raise HTTPException(
            status_code=400,
            detail="Gemini API key not set. Add GEMINI_API_KEY to your .env file.",
        )

    if req.action not in PROMPTS:
        raise HTTPException(status_code=400, detail="action must be 'summary' or 'grammar'")

    prompt = PROMPTS[req.action].format(text=req.text)

    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.0-flash")

        async def stream_response():
            response = model.generate_content(prompt, stream=True)
            for chunk in response:
                if chunk.text:
                    yield chunk.text

        return StreamingResponse(stream_response(), media_type="text/plain")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
