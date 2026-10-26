from pydantic import BaseModel, Field, field_validator
from Servicios.dictado import normalizar_palabras
from typing import Optional
from datetime import datetime

class TutorUpdate(BaseModel):
    nombre: str

class EmailUpdate(BaseModel):
    correo: str
    contrasena_actual: str

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
    fecha_fin: Optional[datetime] = None

class EjercicioTutorCreate(BaseModel):
    id_ejercicio: int
    id_usuario: int
    fecha_fin: Optional[datetime] = None


class DictadoCreate(BaseModel):
    titulo: str = Field(min_length=1, max_length=150)
    palabras: list[str] = Field(min_length=1, max_length=50)
    fecha_fin: Optional[datetime] = None

    @field_validator("titulo")
    @classmethod
    def validar_titulo(cls, valor):
        valor = valor.strip()
        if not valor:
            raise ValueError("Escribe un título para el dictado.")
        return valor

    @field_validator("palabras")
    @classmethod
    def validar_palabras(cls, valor):
        return normalizar_palabras(valor)
