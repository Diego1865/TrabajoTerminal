from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from Modelo.database import connect_to_database
from datetime import datetime
from Control.dependencies import require_tutor, require_alumno

router = APIRouter()


class EjercicioTutorResponse(BaseModel):
    id_ejercicio_tutor: int
    id_ejercicio: int
    titulo: str
    descripcion: Optional[str] = None
    tipo: str

class EjercicioTutorCreate(BaseModel):
    id_ejercicio: int
    id_usuario: int
    fecha_fin:     Optional[datetime] = None



@router.get("/")
async def get_ejercicios():
    conn = connect_to_database()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT id_ejercicio, titulo, descripcion, tipo, contenido_base
            FROM Ejercicios
            WHERE id_estatus = 1
        """)
        rows = cursor.fetchall()
        return [
            {
                "id_ejercicio": r[0],
                "titulo": r[1],
                "descripcion": r[2],
                "tipo": r[3],
                "contenido_base": r[4],
            }
            for r in rows
        ]
    except Exception as e:
        print("Error al obtener los ejercicios:", e)
        raise HTTPException(status_code=500, detail="Error al obtener los ejercicios")
    finally:
        cursor.close()
        conn.close()



@router.get("/tutor/{id_usuario}", response_model=List[EjercicioTutorResponse])
async def get_ejercicios_tutor(id_usuario: int, current_user: dict = Depends(require_tutor)):
    if current_user["id_usuario"] != id_usuario:
        raise HTTPException(status_code=403, detail="No tiene permiso para ver los ejercicios de otro tutor.")

    conn = connect_to_database()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT et.id_ejercicio_tutor, e.id_ejercicio, e.titulo, e.descripcion, e.tipo
            FROM Ejercicios_Tutor et
            JOIN Ejercicios e ON et.id_ejercicio = e.id_ejercicio
            WHERE et.id_usuario = ? AND et.id_estatus = 1
        """, id_usuario)
        rows = cursor.fetchall()
        return [
            EjercicioTutorResponse(
                id_ejercicio_tutor=row[0],
                id_ejercicio=row[1],
                titulo=row[2],
                descripcion=row[3],
                tipo=row[4],
            )
            for row in rows
        ]
    except Exception as e:
        print("Error al obtener ejercicios del tutor:", e)
        raise HTTPException(status_code=500, detail="Error al obtener ejercicios del tutor")
    finally:
        cursor.close()
        conn.close()

@router.post("/tutor", status_code=201)
async def activar_ejercicio(data: EjercicioTutorCreate, current_user: dict = Depends(require_tutor)):
    if current_user["id_usuario"] != data.id_usuario:
        raise HTTPException(status_code=403, detail="No tiene permiso para activar ejercicios para otro tutor.")

    print("Activando ejercicio:", data)
    conn = connect_to_database()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        # Verificar que el ejercicio exista y esté activo
        cursor.execute("""
            SELECT id_ejercicio_tutor FROM Ejercicios_Tutor
            WHERE id_ejercicio = ? AND id_usuario = ? AND id_estatus = 1
        """, (data.id_ejercicio, data.id_usuario))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="El ejercicio ya está activado")

        cursor.execute("""
            INSERT INTO Ejercicios_Tutor (id_ejercicio, id_usuario, id_estatus, fecha_desactivacion)
            VALUES (?, ?, 1,?)
        """, (data.id_ejercicio, data.id_usuario, data.fecha_fin))
        conn.commit()
        return {"message": "Ejercicio activado correctamente"}
    except HTTPException:
        raise
    except Exception as e:
        print("Error al activar ejercicio:", e)
        raise HTTPException(status_code=500, detail="Error al activar el ejercicio")
    finally:
        cursor.close()
        conn.close()



@router.delete("/tutor/{id_usuario}/{id_ejercicio}")
async def desactivar_ejercicio(id_usuario: int, id_ejercicio: int, current_user: dict = Depends(require_tutor)):
    if current_user["id_usuario"] != id_usuario:
        raise HTTPException(status_code=403, detail="No tiene permiso para desactivar ejercicios de otro tutor.")

    conn = connect_to_database()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE Ejercicios_Tutor SET id_estatus = 2
            WHERE id_usuario = ? AND id_ejercicio = ?
        """, (id_usuario, id_ejercicio))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Ejercicio no encontrado")
        return {"message": "Ejercicio desactivado correctamente"}
    except HTTPException:
        raise
    except Exception as e:
        print("Error al desactivar ejercicio:", e)
        raise HTTPException(status_code=500, detail="Error al desactivar el ejercicio")
    finally:
        cursor.close()
        conn.close()

# Ejercicios proximos a vencer para un alumno
@router.get("/alumno/{id_alumno}/proximos")
async def get_ejercicios_proximos(id_alumno: int, current_user: dict = Depends(require_alumno)):
    if current_user["id_usuario"] != id_alumno:
        raise HTTPException(status_code=403, detail="No tiene permiso para ver los ejercicios de otro alumno.")
    
    conn = connect_to_database()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT 
                et.id_ejercicio_tutor, e.id_ejercicio, e.titulo, 
                e.descripcion, e.tipo, e.contenido_base, et.fecha_desactivacion as fecha_fin
            FROM Ejercicios_Tutor et
            JOIN Ejercicios e ON et.id_ejercicio = e.id_ejercicio
            JOIN Usuario a ON a.id_tutor = et.id_usuario AND a.tipo_usuario = 'alumno'
            WHERE a.id_usuario = ?
              AND et.id_estatus = 1
              AND et.id_ejercicio_tutor NOT IN (
                  SELECT id_ejercicio_tutor FROM Intentos WHERE id_usuario = ?
              )
        """, (id_alumno, id_alumno))
        rows = cursor.fetchall()
        return [
            {
                "id_ejercicio_tutor": r[0],
                "id_ejercicio":       r[1],
                "titulo":             r[2],
                "descripcion":        r[3],
                "tipo":               r[4],
                "contenido_base":     r[5],
                "fecha_fin":          r[6],
            }
            for r in rows
        ]
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Error al obtener ejercicios")
    finally:
        cursor.close()
        conn.close()

# Ejercicios completados por un alumno

@router.get("/alumno/{id_alumno}/completados")
async def get_ejercicios_completados(id_alumno: int, current_user: dict = Depends(require_alumno)):
    if current_user["id_usuario"] != id_alumno:
        raise HTTPException(status_code=403, detail="No tiene permiso para ver los ejercicios completados de otro alumno.")

    conn = connect_to_database()
    cursor = conn.cursor()
    try:
        # Se utiliza CTE (Common Table Expression) con ROW_NUMBER 
        # para obtener toda la información del último envío por ejercicio.
        cursor.execute("""
            WITH UltimosIntentos AS (
                SELECT 
                    id_ejercicio_tutor,
                    fecha_envio,
                    imagen_codificada,
                    texto_detectado_ocr,
                    puntuacion,         
                    retroalimentacion,  
                    ROW_NUMBER() OVER(PARTITION BY id_ejercicio_tutor ORDER BY fecha_envio DESC) as rn
                FROM Intentos
                WHERE id_usuario = ?
            )
            SELECT 
                et.id_ejercicio_tutor, 
                e.id_ejercicio, 
                e.titulo,
                e.descripcion, 
                e.tipo, 
                et.fecha_desactivacion as fecha_fin,
                ui.fecha_envio,
                ui.imagen_codificada,
                ui.texto_detectado_ocr,
                ui.puntuacion,
                ui.retroalimentacion
            FROM UltimosIntentos ui
            JOIN Ejercicios_Tutor et ON ui.id_ejercicio_tutor = et.id_ejercicio_tutor
            JOIN Ejercicios e ON et.id_ejercicio = e.id_ejercicio
            WHERE ui.rn = 1
        """, id_alumno)
        
        rows = cursor.fetchall()
        
        return [
            {
                "id_ejercicio_tutor":  r[0],
                "id_ejercicio":        r[1],
                "titulo":              r[2],
                "descripcion":         r[3],
                "tipo":                r[4],
                "fecha_desactivacion": r[5],
                "fecha_envio":         r[6],
                "imagen_codificada":   r[7],
                "texto_detectado_ocr": r[8],
                "puntuacion":          r[9],
                "retroalimentacion":   r[10]
            }
            for r in rows
        ]
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Error al obtener ejercicios completados")
    finally:
        cursor.close()
        conn.close()

# Ejercicios vencidos para un alumno
@router.get("/alumno/{id_alumno}/vencidos")
async def get_ejercicios_vencidos(id_alumno: int, current_user: dict = Depends(require_alumno)):
    if current_user["id_usuario"] != id_alumno:
        raise HTTPException(status_code=403, detail="No tiene permiso para ver los ejercicios vencidos de otro alumno.")

    conn = connect_to_database()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT
                et.id_ejercicio_tutor, e.id_ejercicio, e.titulo,
                e.descripcion, e.tipo, et.fecha_desactivacion
            FROM Ejercicios_Tutor et
            JOIN Ejercicios e ON et.id_ejercicio = e.id_ejercicio
            JOIN Usuario a ON a.id_tutor = et.id_usuario AND a.tipo_usuario = 'alumno'
            WHERE a.id_usuario = ?
              AND et.id_estatus = 2
              AND et.id_ejercicio_tutor NOT IN (
                  SELECT id_ejercicio_tutor FROM Intentos WHERE id_usuario = ?
              )
        """, (id_alumno, id_alumno))
        rows = cursor.fetchall()
        return [
            {
                "id_ejercicio_tutor": r[0],
                "id_ejercicio":       r[1],
                "titulo":             r[2],
                "descripcion":        r[3],
                "tipo":               r[4],
                "fecha_desactivacion":  r[5],
            }
            for r in rows
        ]
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Error al obtener ejercicios vencidos")
    finally:
        cursor.close()
        conn.close()