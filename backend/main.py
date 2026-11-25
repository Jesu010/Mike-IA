
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
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
    clave_gemini = os.getenv("GEMINI_API_KEY")

    if not clave_gemini:
        raise HTTPException(
            status_code=503,
            detail="La conexión con Gemini todavía no está configurada."
        )

    try:
        cliente = genai.Client(api_key=clave_gemini)

        respuesta = cliente.models.generate_content(
            model="gemini-3.8-flash",
            contents=(
                "Sos Mikey AI, un asistente virtual útil, claro y confiable. "
                "Respondé en español rioplatense, con tono amable y natural. "
                "Ayudá tanto con tareas personales como empresariales. "
                "Si no sabés algo, decilo con claridad.\n\n"
                f"Mensaje del usuario: {solicitud.mensaje}"
            )
        )

        texto = respuesta.text

        if not texto:
            raise ValueError("Gemini no devolvió una respuesta de texto.")

        return {"respondedor": texto}

    except Exception as error:
        print(f"Error al consultar Gemini: {error}")
        raise HTTPException(
            status_code=502,
            detail="No se pudo completar la consulta. Revisá la configuración."
        )
