from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from Modelo.database import connect_to_database
from Control.dependencies import require_tutor, require_alumno

router = APIRouter()

# --- Modelos Pydantic ---

class IntentoCreate(BaseModel):
    id_ejercicio_tutor: int
    imagen_codificada: str

class IntentoTutorResponse(BaseModel):
    id_intento: int
    id_usuario: int
    nombre_completo: str
    id_ejercicio_tutor: int
    titulo_ejercicio: str
    fecha_envio: datetime
    imagen_codificada: str
    texto_detectado_ocr: Optional[str] = None
    puntuacion: Optional[int] = None
    retroalimentacion: Optional[str] = None

class CalificarIntentoRequest(BaseModel):
    calificacion: int
    retroalimentacion: Optional[str] = None

# --- Endpoints ---

@router.put("/calificar/{id_intento}")
async def calificar_intento(
    id_intento: int, 
    datos: CalificarIntentoRequest, 
    current_user: dict = Depends(require_tutor)
):
    id_tutor = current_user["id_usuario"]
    conn = connect_to_database()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión a la base de datos")

    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT i.id_intento 
            FROM Intentos i
            JOIN Usuario a ON i.id_usuario = a.id_usuario
            WHERE i.id_intento = ? AND a.id_tutor = ? AND a.tipo_usuario = 'alumno'
        """, (id_intento, id_tutor))
        
        if not cursor.fetchone():
            raise HTTPException(
                status_code=403, 
                detail="No tiene permiso para calificar este intento o no existe."
            )

        cursor.execute("""
            UPDATE Intentos
            SET puntuacion = ?, retroalimentacion = ?
            WHERE id_intento = ?
        """, (datos.calificacion, datos.retroalimentacion, id_intento))
        
        conn.commit()
        return {"message": "Calificación registrada correctamente."}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error al calificar: {e}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    finally:
        cursor.close()
        conn.close()

@router.post("/registrar", status_code=status.HTTP_201_CREATED)
async def registrar_intento(intento_data: IntentoCreate, current_user: dict = Depends(require_alumno)):
    conn = connect_to_database()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")

    cursor = conn.cursor()
    try:
        id_usuario = current_user["id_usuario"]
        cursor.execute("SELECT id_estatus FROM Ejercicios_Tutor WHERE id_ejercicio_tutor = ?", (intento_data.id_ejercicio_tutor,))
        ejercicio = cursor.fetchone()
        
        if not ejercicio:
            raise HTTPException(status_code=404, detail="Ejercicio no encontrado.")
        
        cursor.execute("""
            INSERT INTO Intentos (id_usuario, id_ejercicio_tutor, imagen_codificada)
            VALUES (?, ?, ?)
        """, (id_usuario, intento_data.id_ejercicio_tutor, intento_data.imagen_codificada))
        conn.commit()
        return {"message": "Intento registrado."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@router.get("/tutor/{id_tutor}", response_model=List[IntentoTutorResponse])
async def obtener_intentos_por_tutor(id_tutor: int, current_user: dict = Depends(require_tutor)):
    if current_user["id_usuario"] != id_tutor:
        raise HTTPException(status_code=403, detail="Acceso denegado.")

    conn = connect_to_database()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")

    cursor = conn.cursor()
    try:
        query = """
            SELECT 
                i.id_intento, 
                i.id_usuario, 
                LTRIM(RTRIM(CONCAT(a.nombre, ' ', a.apellido_paterno, ' ', a.apellido_materno))) AS nombre_completo,
                i.id_ejercicio_tutor, 
                e.titulo, 
                i.fecha_envio, 
                i.imagen_codificada,
                i.texto_detectado_ocr,
                i.puntuacion,        
                i.retroalimentacion  
            FROM Intentos i
            INNER JOIN Usuario a ON i.id_usuario = a.id_usuario
            INNER JOIN Ejercicios_Tutor et ON i.id_ejercicio_tutor = et.id_ejercicio_tutor
            INNER JOIN Ejercicios e ON et.id_ejercicio = e.id_ejercicio
            WHERE a.id_tutor = ? AND a.tipo_usuario = 'alumno'
            ORDER BY i.fecha_envio DESC
        """
        cursor.execute(query, (id_tutor,))
        rows = cursor.fetchall()

        intentos = []
        for row in rows:
            intentos.append({
                "id_intento": row[0],
                "id_usuario": row[1],
                "nombre_completo": row[2],
                "id_ejercicio_tutor": row[3],
                "titulo_ejercicio": row[4],
                "fecha_envio": row[5],
                "imagen_codificada": row[6],
                "texto_detectado_ocr": row[7],
                "puntuacion": row[8],
                "retroalimentacion": row[9]
            })

        return intentos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()