from fastapi import APIRouter, HTTPException, status, Depends
from Control.auth import get_password_hash

from Modelo.schemas_alumno import AlumnoCreate, AlumnoResponse, AlumnoProgresoResponse
from Modelo.dao_alumnos import registrar_alumno_db, obtener_alumnos_por_tutor_db

Router = APIRouter()

