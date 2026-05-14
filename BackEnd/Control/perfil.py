from fastapi import APIRouter, HTTPException, Depends, status
from Modelo.database import connect_to_database
from Control.auth import verify_password, get_password_hash
from Control.dependencies import get_current_user
from Modelo.schemas_tutor import TutorUpdate, EmailUpdate
from Modelo.schemas_auth import PasswordUpdate, DeleteAccount
from Modelo.schemas_alumno import AlumnoUpdate

router = APIRouter()


@router.put("/alumno/info")
def actualizar_info_alumno(data: AlumnoUpdate, current_user: dict = Depends(get_current_user)):
    if current_user.get("tipo_usuario") != "alumno": raise HTTPException(status_code=403, detail="Acceso denegado")
    
    conn = connect_to_database()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE Usuario 
            SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, grupo = ? 
            WHERE id_usuario = ?
        """, (data.nombre, data.apellido_paterno, data.apellido_materno, data.grupo, current_user["id_usuario"]))
        conn.commit()
        return {"message": "Información actualizada correctamente"}
    finally:
        cursor.close()
        conn.close()

@router.put("/alumno/password")
def actualizar_password_alumno(data: PasswordUpdate, current_user: dict = Depends(get_current_user)):
    if current_user.get("tipo_usuario") != "alumno": raise HTTPException(status_code=403, detail="Acceso denegado")
    
    conn = connect_to_database()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT contrasena_cifrada FROM Usuario WHERE id_usuario = ?", (current_user["id_usuario"],))
        hash_db = cursor.fetchone()[0]
        if not verify_password(data.contrasena_actual, hash_db):
            raise HTTPException(status_code=400, detail="La contraseña actual es incorrecta")
            
        nuevo_hash = get_password_hash(data.nueva_contrasena)
        cursor.execute("UPDATE Usuario SET contrasena_cifrada = ? WHERE id_usuario = ?", (nuevo_hash, current_user["id_usuario"]))
        conn.commit()
        return {"message": "Contraseña actualizada correctamente"}
    finally:
        cursor.close()
        conn.close()

@router.get("/alumno/estado-tutor")
def verificar_estado_tutor(current_user: dict = Depends(get_current_user)):
    if current_user.get("tipo_usuario") != "alumno": raise HTTPException(status_code=403, detail="Acceso denegado")
    
    conn = connect_to_database()
    cursor = conn.cursor()
    try:
        # Obtiene el estatus del tutor asociado al alumno
        cursor.execute("""
            SELECT u.id_estatus 
            FROM Usuario u
            WHERE u.id_usuario = (SELECT id_tutor FROM Usuario WHERE id_usuario = ? AND tipo_usuario = 'alumno')
        """, (current_user["id_usuario"],))
        
        row = cursor.fetchone()
        if not row:
            return {"tutor_activo": False}
            
        # Si el id_estatus es 1, está activo
        return {"tutor_activo": row[0] == 1}
    finally:
        cursor.close()
        conn.close()