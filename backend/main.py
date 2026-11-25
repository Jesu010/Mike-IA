import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Mikey AI API", version="0.1.0")

allowed_origin = os.getenv("ALLOWED_ORIGIN", "https://jesu010.github.io")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[allowed_origin],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=8000)

@app.get("/")
def root():
    return {"app": "Mikey AI API", "status": "ok"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat")
def chat(payload: ChatRequest):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="La conexión con IA todavía no está activada.")
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            instructions=(
                "Sos Mikey AI, un asistente virtual útil, claro y confiable. "
                "Respondé en español rioplatense, con tono amable. "
                "Si no sabés algo, decilo con claridad."
            ),
            input=payload.message,
        )
        return {"reply": response.output_text}
    except Exception:
        raise HTTPException(status_code=502, detail="No se pudo completar la consulta. Revisá la configuración del servidor.")
