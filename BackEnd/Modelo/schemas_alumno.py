from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

class AlumnoCreate(BaseModel):
    nombre: str
    apellido_paterno: str
    apellido_materno: Optional[str] = None
    usuario: str
    contrasena: str
    grado: str
    grupo: Optional[str] = None
    id_tutor: int

class AlumnoResponse(BaseModel):
    id_alumno: int
    nombre: str
    apellido_paterno: str
    apellido_materno: Optional[str]
    usuario: str
    grado: str
    grupo: Optional[str]

class AlumnoProgresoResponse(BaseModel):
    id_alumno: int
    nombre: str
    apellido_paterno: str
    apellido_materno: str
    promedio_ortografia: Decimal
    promedio_legibilidad: Decimal