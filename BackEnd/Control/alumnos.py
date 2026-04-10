from decimal import Decimal
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

class AlumnoEnRiesgoResponse(BaseModel):
    id_alumno: int
    nombre: str
    apellido_paterno: str
    apellido_materno: str
    promedio_ortografia: Decimal
    promedio_legibilidad: Decimal

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

# Alumnos en riesgo

@router.get("/riesgo/{id_tutor}", response_model=List[AlumnoEnRiesgoResponse])
async def obtener_alumnos_en_riesgo(id_tutor: int):
    conn = connect_to_database()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión a la base de datos")

    cursor = conn.cursor()
    try:
        query = """
            WITH PromedialidadAlumnos AS (
                SELECT a.id_alumno, a.nombre, a.apellido_paterno, a.apellido_materno, 
                    p.promedio_ortografia,
                    (p.aliniacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4 AS promedio_legibilidad
                FROM Usuario tu
                JOIN Alumno a ON tu.id_usuario = a.id_tutor
                JOIN Progreso_Alumno p ON a.id_alumno = p.id_alumno
                WHERE tu.id_usuario = ?
            )
            SELECT *
            FROM PromedialidadAlumnos
            WHERE promedio_ortografia < 6.0 
            OR promedio_legibilidad < 6.0
        """
        cursor.execute(query, id_tutor)
        rows = cursor.fetchall()

        alumnos_en_riesgo = []
        for row in rows:
            alumnos_en_riesgo.append({
                "id_alumno": row[0],
                "nombre": row[1],
                "apellido_paterno": row[2],
                "apellido_materno": row[3],
                "promedio_ortografia": row[4],
                "promedio_legibilidad": row[5]
            })

        return alumnos_en_riesgo

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener alumnos en riesgo: {str(e)}")
    finally:
        cursor.close()
        conn.close()



@router.get("/progreso/{id_tutor}")
async def obtener_progreso_grafico(id_tutor: int):
    conn = connect_to_database()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión a la base de datos")

    cursor = conn.cursor()
    try:
        # Query 1: Progreso Ortografía
        query1 = """
            SELECT 
                CASE 
                    WHEN promedio_ortografia > 8 THEN 'Buen Promedio'
                    WHEN promedio_ortografia BETWEEN 6 AND 8 THEN 'Promedio Regular'
                    ELSE 'Mal Promedio'
                END AS categoria,
                COUNT(DISTINCT p.id_alumno) AS cantidad_alumnos
            FROM Usuario tu
                JOIN Alumno a ON tu.id_usuario = a.id_tutor
                JOIN Progreso_Alumno p ON a.id_alumno = p.id_alumno
            WHERE tu.id_usuario = ?
            GROUP BY 
                CASE 
                    WHEN promedio_ortografia > 8 THEN 'Buen Promedio'
                    WHEN promedio_ortografia BETWEEN 6 AND 8 THEN 'Promedio Regular'
                    ELSE 'Mal Promedio'
                END
            ORDER BY cantidad_alumnos DESC;
        """
        cursor.execute(query1, (id_tutor,))
        rows = cursor.fetchall()

        progreso_ortografico = []
        for row in rows:
            progreso_ortografico.append({
                "categoria": row[0],
                "cantidad_alumnos": row[1]
            })

        # Query 2: Progreso Legibilidad
        query2 = """
            WITH ProgresoLegibilidad AS (
                SELECT
                    (aliniacion_score + tamano_letra_score + espaciado_score + inclinacion_score) / 4 AS promedio_legibilidad
                FROM Usuario tu
                JOIN Alumno a ON tu.id_usuario = a.id_tutor
                JOIN Progreso_Alumno p ON a.id_alumno = p.id_alumno
                WHERE tu.id_usuario = ?
            )
            SELECT 
                CASE 
                    WHEN promedio_legibilidad > 8 THEN 'Buena Legibilidad'
                    WHEN promedio_legibilidad BETWEEN 6 AND 8 THEN 'Legibilidad Regular'
                    ELSE 'Mala Legibilidad'
                END AS categoria,
                COUNT(*) AS cantidad_alumnos
            FROM ProgresoLegibilidad
            GROUP BY 
                CASE 
                    WHEN promedio_legibilidad > 8 THEN 'Buena Legibilidad'
                    WHEN promedio_legibilidad BETWEEN 6 AND 8 THEN 'Legibilidad Regular'
                    ELSE 'Mala Legibilidad'
                END
            ORDER BY cantidad_alumnos DESC;
        """
        cursor.execute(query2, (id_tutor,))
        rows = cursor.fetchall()

        progreso_legibilidad = []
        for row in rows:
            progreso_legibilidad.append({
                "categoria": row[0],
                "cantidad_alumnos": row[1]
            })
        print(progreso_legibilidad)
        print(progreso_ortografico)
        return {
            "ortografia": progreso_ortografico,
            "legibilidad": progreso_legibilidad
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener progreso gráfico: {str(e)}")
    finally:
        cursor.close()
        conn.close()