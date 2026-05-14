from fastapi import APIRouter, HTTPException, status, Depends
from Control.auth import get_password_hash
from Control.dependencies import require_tutor
from typing import List
from Modelo.schemas_alumno import AlumnoCreate, AlumnoResponse, AlumnoProgresoResponse
from Modelo.dao_tutor import registrar_alumno_dao, obtener_alumnos_por_tutor_dao, dar_de_baja_alumno_dao, obtener_alumnos_en_riesgo_dao, obtener_alumnos_regular_dao, obtener_alumnos_excelencia_dao, obtener_progreso_grafico_dao

router = APIRouter()

@router.post("/registrar", response_model=dict)
def registrar_alumno(alumno_data: AlumnoCreate, current_user: dict = Depends(require_tutor)):
    if alumno_data.id_tutor != current_user["id_usuario"]:
        raise HTTPException(status_code=403, detail="No tiene permiso para registrar alumnos para otro tutor.")

    hashed_password = get_password_hash(alumno_data.contrasena)

    try:
        
        registrar_alumno_dao(alumno_data, hashed_password)
        return {"message": "Alumno registrado exitosamente"}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al registrar alumno: {str(e)}")

@router.get("/alumnos/{id_tutor}", response_model=List[AlumnoResponse])
def obtener_alumnos_por_tutor(id_tutor: int, current_user: dict = Depends(require_tutor)):
    if current_user["id_usuario"] != id_tutor:
        raise HTTPException(status_code=403, detail="No tiene permiso para ver los alumnos de otro tutor.")
    
    try:
        return obtener_alumnos_por_tutor_dao(id_tutor)
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener alumnos: {str(e)}")

@router.put("/baja/{id_alumno}")
def dar_de_baja_alumno(id_alumno: int, current_user: dict = Depends(require_tutor)):
    if alumno_data.id_tutor != current_user["id_usuario"]:
        raise HTTPException(status_code=403, detail="No tiene permiso para dar de baja alumnos para otro tutor.")

    try:
        dar_de_baja_alumno_dao(id_alumno, current_user["id_usuario"])
        return {"message": "Alumno dado de baja exitosamente"}
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except FileNotFoundError as fnfe:
        raise HTTPException(status_code=404, detail=str(fnfe))
    except PermissionError as pe:
        raise HTTPException(status_code=403, detail=str(pe))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el servidor: {str(e)}")

@router.get("/riesgo/{id_tutor}", response_model=List[AlumnoProgresoResponse])
def obtener_alumnos_en_riesgo(id_tutor: int, current_user: dict = Depends(require_tutor)):
    if current_user["id_usuario"] != id_tutor:
        raise HTTPException(status_code=403, detail="No tiene permiso para ver los alumnos en riesgo de otro tutor.")

    try:
        return obtener_alumnos_en_riesgo_dao(id_tutor)
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener alumnos en riesgo: {str(e)}")

@router.get("/regular/{id_tutor}", response_model=List[AlumnoProgresoResponse])
def obtener_alumnos_regular(id_tutor: int, current_user: dict = Depends(require_tutor)):
    if current_user["id_usuario"] != id_tutor:
        raise HTTPException(status_code=403, detail="No tiene permiso para ver los alumnos regulares de otro tutor.")
    
    try:
        return obtener_alumnos_regular_dao(id_tutor)
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener alumnos regulares: {str(e)}")

@router.get("/excelencia/{id_tutor}", response_model=List[AlumnoProgresoResponse])
def obtener_alumnos_excelencia(id_tutor: int, current_user: dict = Depends(require_tutor)):
    if current_user["id_usuario"] != id_tutor:
        raise HTTPException(status_code=403, detail="No tiene permiso para ver los alumnos de excelencia de otro tutor.")
    
    try:
        return obtener_alumnos_excelencia_dao(id_tutor)
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener alumnos de excelencia: {str(e)}")

@router.get("/progreso/{id_tutor}")
def obtener_progreso_grafico(id_tutor: int, current_user: dict = Depends(require_tutor)):
    if current_user["id_usuario"] != id_tutor:
        raise HTTPException(status_code=403, detail="No tiene permiso para ver el progreso de otro tutor.")

    try:
        
        return obtener_progreso_grafico_dao(id_tutor)
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener progreso gráfico: {str(e)}")