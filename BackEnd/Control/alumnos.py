from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from Modelo.database import connect_to_database
from Control.auth import get_password_hash

router = APIRouter()

# Modelos Pydantic
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

@router.post("/registrar", response_model=dict)
async def registrar_alumno(alumno_data: AlumnoCreate):
    conn = connect_to_database()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión a la base de datos")

    cursor = conn.cursor()
    try:
        # Verificar si el usuario ya existe para evitar duplicados
        cursor.execute("SELECT id_alumno FROM Alumno WHERE usuario = ?", alumno_data.usuario)
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="El nombre de usuario del alumno ya está en uso")

        hashed_password = get_password_hash(alumno_data.contrasena)
        
        query = """
            INSERT INTO Alumno 
            (nombre, apellido_paterno, apellido_materno, usuario, contrasena_cifrada, grado, grupo, id_tutor, id_estatus)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        """
        cursor.execute(query, (
            alumno_data.nombre, 
            alumno_data.apellido_paterno, 
            alumno_data.apellido_materno, 
            alumno_data.usuario, 
            hashed_password, 
            alumno_data.grado, 
            alumno_data.grupo, 
            alumno_data.id_tutor
        ))
        conn.commit()

        return {"message": "Alumno registrado exitosamente"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al registrar alumno: {str(e)}")
    finally:
        cursor.close()
        conn.close()

@router.get("/tutor/{id_tutor}", response_model=List[AlumnoResponse])
async def obtener_alumnos_por_tutor(id_tutor: int):
    conn = connect_to_database()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión a la base de datos")

    cursor = conn.cursor()
    try:
        query = """
            SELECT id_alumno, nombre, apellido_paterno, apellido_materno, usuario, grado, grupo 
            FROM Alumno 
            WHERE id_tutor = ? AND id_estatus = 1
        """
        cursor.execute(query, id_tutor)
        rows = cursor.fetchall()

        alumnos = []
        for row in rows:
            alumnos.append({
                "id_alumno": row[0],
                "nombre": row[1],
                "apellido_paterno": row[2],
                "apellido_materno": row[3],
                "usuario": row[4],
                "grado": row[5],
                "grupo": row[6]
            })

        return alumnos

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener alumnos: {str(e)}")
    finally:
        cursor.close()
        conn.close()

@router.put("/baja/{id_alumno}")
async def dar_de_baja_alumno(id_alumno: int):
    conn = connect_to_database()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión a la base de datos")

    cursor = conn.cursor()
    try:
        # Actualizar a estatus 2 (inactivo)
        query = "UPDATE Alumno SET id_estatus = 2 WHERE id_alumno = ?"
        cursor.execute(query, id_alumno)
        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Alumno no encontrado")

        return {"message": "Alumno dado de baja exitosamente"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el servidor: {str(e)}")
    finally:
        cursor.close()
        conn.close()