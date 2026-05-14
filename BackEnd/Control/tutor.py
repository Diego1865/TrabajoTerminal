from fastapi import APIRouter, HTTPException, status, Depends
from Control.auth import get_password_hash, verify_password
from Control.dependencies import require_tutor
from typing import List
from Modelo.schemas_alumno import AlumnoCreate, AlumnoResponse, AlumnoProgresoResponse
from Modelo.dao_tutor import * 
from Modelo.schemas_tutor import *
from Modelo.schemas_auth import PasswordUpdate, DeleteAccount
from Modelo.dao_auth import obtener_hash_contrasena_dao

router = APIRouter()

#Funciones relacionadas con el tutor y sus alumnos
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

#Perfil del tutor
@router.put("/act/nombre")
def actualizar_nombre_tutor(data: TutorUpdate, current_user: dict = Depends(require_tutor)):
   
    try:
        actualizar_nombre_tutor_dao(data.nombre, current_user["id_usuario"])
        return {"message": "Nombre actualizado correctamente"}
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar nombre: {str(e)}")

@router.put("/act/correo")
def actualizar_correo_tutor(data: EmailUpdate, current_user: dict = Depends(require_tutor)):
    
    try:
        hash_db = obtener_hash_contrasena_dao(current_user["id_usuario"])
        if not verify_password(data.contrasena_actual, hash_db):
            raise HTTPException(status_code=400, detail="La contraseña actual es incorrecta")
        actualizar_correo_tutor_dao(current_user["id_usuario"], data.correo)
        return {"message": "Correo actualizado correctamente"}
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar correo: {str(e)}")

@router.put("/act/password")
def actualizar_password_tutor(data: PasswordUpdate, current_user: dict = Depends(require_tutor)):
    
    try:
        hash_db = obtener_hash_contrasena_dao(current_user["id_usuario"])
        if not verify_password(data.contrasena_actual, hash_db):
            raise HTTPException(status_code=400, detail="La contraseña actual es incorrecta")
            
        actualizar_password_tutor_dao(data.nueva_contrasena, current_user["id_usuario"])
        conn.commit()
        return {"message": "Contraseña actualizada correctamente"}
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar contraseña: {str(e)}")

@router.delete("/eliminar")
def eliminar_cuenta_tutor(data: DeleteAccount, current_user: dict = Depends(require_tutor)):
    
    try:
        hash_db = obtener_hash_contrasena_dao(current_user["id_usuario"])
        if not verify_password(data.contrasena_actual, hash_db):
            raise HTTPException(status_code=400, detail="La contraseña actual es incorrecta")
        eliminar_cuenta_tutor(current_user["id_usuario"])
        return {"message": "Cuenta eliminada/desactivada correctamente"}
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar cuenta: {str(e)}")

#intentos relacionados al tutor
@router.put("/calificar/{id_intento}")
def calificar_intento(id_intento: int, datos: CalificarIntentoRequest, current_user: dict = Depends(require_tutor)):
    try:
        intento = obtener_intento_tutor_dao(id_intento, current_user["id_usuario"])
        calificar_intento_dao(id_intento, datos.calificacion, datos.retroalimentacion)
        return {"message": "Calificación registrada correctamente."}
    except PermissionError as pe:
        raise HTTPException(status_code=403, detail=str(pe))
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except Exception as e:
        print(f"Error al calificar: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor")

@router.get("/intentos/{id_tutor}", response_model=List[IntentoTutorResponse])
def obtener_intentos_por_tutor(id_tutor: int, current_user: dict = Depends(require_tutor)):
    if current_user["id_usuario"] != id_tutor:
        raise HTTPException(status_code=403, detail="Acceso denegado.")

    try:
        return obtener_intentos_por_tutor_dao(id_tutor)
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#ejercicios relacionados al tutor
@router.get("/ejercicios")
def get_ejercicios():
    try:
        return get_ejercicios_dao()
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except Exception as e:
        print("Error al obtener los ejercicios:", e)
        raise HTTPException(status_code=500, detail="Error al obtener los ejercicios")

@router.get("/ejercicios/{id_usuario}", response_model=List[EjercicioTutorResponse])
def get_ejercicios_tutor(id_usuario: int, current_user: dict = Depends(require_tutor)):
    if current_user["id_usuario"] != id_usuario:
        raise HTTPException(status_code=403, detail="No tiene permiso para ver los ejercicios de otro tutor.")
    
    try:
        return get_ejercicios_tutor_dao(id_usuario)
    except ConnectionError as ce:
        raise HTTPException(status_code=500, detail=str(ce))
    except Exception as e:
        print("Error al obtener ejercicios del tutor:", e)
        raise HTTPException(status_code=500, detail="Error al obtener ejercicios del tutor")

@router.post("/ejercicio/activar", status_code=201)
def activar_ejercicio(data: EjercicioTutorCreate, current_user: dict = Depends(require_tutor)):
    if current_user["id_usuario"] != data.id_usuario:
        raise HTTPException(status_code=403, detail="No tiene permiso para activar ejercicios para otro tutor")
    
    try:
        activar_ejercicio_tutor_dao(data.id_ejercicio, data.id_usuario, data.fecha_fin)
        return {"message": "Ejercicio activado correctamente"}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")

@router.delete("/ejercicio/desactivar/{id_usuario}/{id_ejercicio}")
def desactivar_ejercicio(id_usuario: int, id_ejercicio: int, current_user: dict = Depends(require_tutor)):
    if current_user["id_usuario"] != id_usuario:
        raise HTTPException(status_code=403, detail="No tiene permiso para desactivar ejercicios de otro tutor")
    
    try:
        desactivar_ejercicio_tutor_dao(id_usuario, id_ejercicio)
        return {"message": "Ejercicio desactivado correctamente"}
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")