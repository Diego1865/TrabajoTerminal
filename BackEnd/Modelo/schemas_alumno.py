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
    apellido_materno: Optional[str] = None
    promedio_ortografia: Optional[Decimal] = None
    # Sin análisis caligráfico todavía, la legibilidad es NULL y el general usa solo ortografía.
    promedio_legibilidad: Optional[Decimal] = None
    promedio_general: Optional[Decimal] = None

class AlumnoUpdate(BaseModel):
    nombre: str
    apellido_paterno: str
    apellido_materno: Optional[str]
    grupo: Optional[str]

class IntentoCreate(BaseModel):
    id_ejercicio_tutor: int
    imagen_codificada: str