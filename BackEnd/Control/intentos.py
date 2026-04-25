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
    """
    Actualiza la calificación y retroalimentación de un intento específico.
    Verifica que el tutor tenga permiso sobre el alumno del intento.
    """
    id_tutor = current_user["id_usuario"]
    conn = connect_to_database()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Error de conexión a la base de datos"
        )

    cursor = conn.cursor()
    try:
        # Verificar que el intento existe y pertenece a un alumno del tutor logueado
        cursor.execute("""
            SELECT i.id_intento 
            FROM Intentos i
            JOIN Usuario a ON i.id_usuario = a.id_usuario
            WHERE i.id_intento = ? AND a.id_tutor = ? AND a.tipo_usuario = 'alumno'
        """, (id_intento, id_tutor))
        
        if not cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="No tienes permiso para calificar este intento o el intento no existe."
            )

        # Actualizar el registro en la tabla Intentos
        # Nota: Asegúrate de que las columnas 'puntuacion' y 'retroalimentacion' existan en tu tabla
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Error al procesar la calificación: {str(e)}"
        )
    finally:
        cursor.close()
        conn.close()

@router.post("/registrar", status_code=status.HTTP_201_CREATED)
async def registrar_intento(intento_data: IntentoCreate, current_user: dict = Depends(require_alumno)):
    
    # Registra un nuevo intento de escritura realizado por un alumno.
    
    conn = connect_to_database()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Error de conexión a la base de datos"
        )

    cursor = conn.cursor()
    try:
        # El id_usuario se extrae de forma segura del token JWT
        id_usuario = current_user["id_usuario"]

        # Verificar que el ejercicio_tutor exista y esté activo
        cursor.execute("""
            SELECT id_estatus FROM Ejercicios_Tutor 
            WHERE id_ejercicio_tutor = ?
        """, (intento_data.id_ejercicio_tutor,))
        
        ejercicio = cursor.fetchone()
        if not ejercicio:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ejercicio no encontrado.")
        if ejercicio[0] != 1:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El ejercicio no se encuentra activo.")

        # Insertar el intento usando id_usuario según el nuevo esquema
        query = """
            INSERT INTO Intentos (id_usuario, id_ejercicio_tutor, imagen_codificada)
            VALUES (?, ?, ?)
        """
        cursor.execute(query, (
            id_usuario, 
            intento_data.id_ejercicio_tutor, 
            intento_data.imagen_codificada
        ))
        conn.commit()

        return {"message": "Intento registrado exitosamente. Pendiente de revisión automática."}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Error al registrar el intento: {str(e)}"
        )
    finally:
        cursor.close()
        conn.close()


@router.get("/tutor/{id_tutor}", response_model=List[IntentoTutorResponse])
async def obtener_intentos_por_tutor(id_tutor: int, current_user: dict = Depends(require_tutor)):
    
    # Obtiene el historial de intentos de todos los alumnos asignados a un tutor específico.
    
    # Verificar autorización cruzada
    if current_user["id_usuario"] != id_tutor:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="No tiene permiso para consultar los intentos de los alumnos de otro tutor."
        )

    conn = connect_to_database()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Error de conexión a la base de datos"
        )

    cursor = conn.cursor()
    try:
        # Consulta JOIN actualizada para usar la tabla Usuario
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
                "texto_detectado_ocr": row[7]
            })

        return intentos

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Error al obtener los intentos: {str(e)}"
        )
    finally:
        cursor.close()
        conn.close()