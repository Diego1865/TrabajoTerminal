from pydantic import BaseModel
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

class IntentoTutorResponse(BaseModel):
    id_intento: int
    id_alumno: int
    nombre_completo: str
    id_ejercicio_tutor: int
    titulo_ejercicio: str
    fecha_envio: datetime
    imagen_codificada: str
    texto_detectado_ocr: Optional[str] = None
    puntuacion: Optional[int] = None
    retroalimentacion: Optional[str] = None

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