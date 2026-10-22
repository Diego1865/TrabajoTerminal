from pydantic import BaseModel, Field, field_validator
from Modelo.schemas_auth import validar_correo
from typing import Optional
from datetime import datetime

class TutorUpdate(BaseModel):
    nombre: str

class CorreoCodigoRequest(BaseModel):
    correo: str

    @field_validator('correo')
    @classmethod
    def revisar_correo(cls, v: str) -> str:
        return validar_correo(v)

class EmailUpdate(BaseModel):
    correo: str
    contrasena_actual: str
    # Código enviado al correo nuevo, para confirmar que existe y es del tutor.
    codigo: str
    token_verificacion: str

    @field_validator('correo')
    @classmethod
    def revisar_correo(cls, v: str) -> str:
        return validar_correo(v)

class PasswordAlumnoUpdate(BaseModel):
    nueva_contrasena: str = Field(..., min_length=6, max_length=72)

class CalificarIntentoRequest(BaseModel):
    calificacion: int
    retroalimentacion: Optional[str] = None
    # CLS confirmado por el tutor; solo así cuenta para el promedio de ortografía.
    # Las secuencias posibles las calcula el servidor a partir de la respuesta esperada.
    cls_correctas: Optional[int] = Field(default=None, ge=0)

class IntentoTutorResponse(BaseModel):
    id_intento: int
    id_alumno: int
    nombre_completo: str
    id_ejercicio_tutor: int
    titulo_ejercicio: str
    fecha_envio: datetime
    imagen_codificada: str
    texto_detectado_ocr: Optional[str] = None
    evaluacion_preliminar: Optional[dict] = None
    puntuacion: Optional[int] = None
    retroalimentacion: Optional[str] = None
    cls_confirmado: Optional[dict] = None
    cls_sugerido: Optional[dict] = None

class EjercicioTutorResponse(BaseModel):
    id_ejercicio_tutor: int
    id_ejercicio: int
    titulo: str
    descripcion: Optional[str] = None
    tipo: str

class EjercicioTutorCreate(BaseModel):
    id_ejercicio: int
    id_usuario: int
    fecha_fin: Optional[datetime] = None
