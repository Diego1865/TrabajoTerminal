from fastapi import APIRouter, HTTPException, status, Depends
from Control.auth import get_password_hash, verify_password
from Control.dependencies import require_alumno
from Modelo.schemas_alumno import AlumnoUpdate, IntentoCreate
from Modelo.schemas_auth import PasswordUpdate
from Modelo.dao_alumno import *
from Modelo.dao_auth import obtener_hash_contrasena_dao

Router = APIRouter()

@router.put("/info")
def actualizar_info_alumno(data: AlumnoUpdate, current_user: dict = Depends(require_alumno)):
    
    try:
        actualizar_info_alumno_dao(data.nombre, data.apellido_paterno, data.apellido_materno, data.grupo, current_user["id_usuario"])
        return {"message": "Información actualizada correctamente"}
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/act/password")
def actualizar_password_alumno(data: PasswordUpdate, current_user: dict = Depends(require_alumno)):
    
    try:
        hash_db = obtener_hash_contrasena_dao(current_user["id_usuario"])
        if not verify_password(data.contrasena_actual, hash_db):
            raise HTTPException(status_code=400, detail="La contraseña actual es incorrecta")
            
        nuevo_hash = get_password_hash(data.nueva_contrasena)
        actualizar_password_alumno_dao(nuevo_hash, current_user["id_usuario"])
        return {"message": "Contraseña actualizada correctamente"}
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/estado-tutor")
def verificar_estado_tutor(current_user: dict = Depends(require_alumno)):

    try:
        stat = verificar_estado_tutor_dao(current_user["id_usuario"])
        if stat is None:
            return {"tutor_activo": False}
            
        return {"tutor_activo": stat == 1}
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/intento", status_code=status.HTTP_201_CREATED)
def registrar_intento(intento_data: IntentoCreate, current_user: dict = Depends(require_alumno)):
    
    try:
        registrar_intento_dao(intento_data.id_ejercicio_tutor, intento_data.imagen_codificada, current_user["id_usuario"])
        return {"message": "Intento registrado."}
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))