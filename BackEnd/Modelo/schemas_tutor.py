from pydantic import BaseModel, model_validator
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
    cls_correctas: Optional[int] = None
    cls_posibles: Optional[int] = None

    @model_validator(mode="after")
    def validar_cls(self):
        if (self.cls_correctas is None) != (self.cls_posibles is None):
            raise ValueError("Indica las secuencias correctas y las posibles, o ninguna de las dos.")
        if self.cls_posibles is not None and not 0 <= self.cls_correctas <= self.cls_posibles or self.cls_posibles == 0:
            raise ValueError("Las secuencias correctas deben estar entre 0 y las posibles, y las posibles deben ser mayores que 0.")
        return self

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
