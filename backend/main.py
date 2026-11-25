
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel, Field

app = FastAPI(title="API de IA de Mikey", version="1.0.0")

origen_permitido = os.getenv(
    "ORIGEN_PERMITIDO",
    "https://jesu010.github.io"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origen_permitido],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)


class SolicitudChat(BaseModel):
    mensaje: str = Field(min_length=1, max_length=8000)


@app.get("/")
def inicio():
    return {"aplicacion": "API de IA de Mikey", "estado": "OK"}


@app.get("/salud")
def salud():
    return {"estado": "OK"}


@app.post("/charlar")
def charlar(solicitud: SolicitudChat):
    clave_api = os.getenv("CLAVE_API_OPENAI")

    if not clave_api:
        raise HTTPException(
            status_code=503,
            detail="La conexión con IA todavía no está activada."
        )

    try:
        cliente = OpenAI(api_key=clave_api)

        respuesta = cliente.responses.create(
            model=os.getenv("MODELO_OPENAI", "gpt-4.1-mini"),
            instructions=(
                "Sos Mikey AI, un asistente virtual útil, claro y confiable. "
                "Respondé en español rioplatense, con tono amable. "
                "Si no sabés algo, decilo con claridad."
            ),
            input=solicitud.mensaje,
        )

        return {"responder": respuesta.output_text}

    except Exception:
        raise HTTPException(
            status_code=502,
            detail="No se pudo completar la consulta. Revisá la configuración."
        )

