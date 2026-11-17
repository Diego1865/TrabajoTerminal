"""Recomendaciones independientes de Ejercicios y Ejercicios_Tutor."""
import json

from Modelo.database import connect_to_database
from Servicios.retroalimentacion import crear_recomendacion


def guardar_recomendacion(cursor, id_intento, id_alumno, contenido):
    """Se ejecuta dentro de la transacción que confirma las notas del intento.

    El UPDATE previo de Intentos serializa las recalificaciones del mismo intento.
    Se reemplaza la recomendación automática, incluso si deja de ser necesaria.
    """
    cursor.execute("""
        SELECT promedio_ortografia, promedio_legibilidad
        FROM vw_Progreso_Alumno WHERE id_alumno = ?
    """, (id_alumno,))
    promedios = cursor.fetchone()
    recomendacion = crear_recomendacion(*promedios, contenido) if promedios else None
    cursor.execute("DELETE FROM Recomendacion WHERE id_intento = ? AND detalle_json IS NOT NULL", (id_intento,))
    if recomendacion:
        cursor.execute("""
            SELECT id_actividad FROM Actividad_Sugerida
            WHERE tipo_error = ? AND tipo_ejercicio = 'retroalimentacion' AND id_estatus = 1
        """, (f"promedio_{recomendacion['area']}_bajo",))
        actividad = cursor.fetchone()
        if not actividad:
            raise ValueError("Falta el catálogo de retroalimentación. Aplica la migración 007.")
        cursor.execute("""
            INSERT INTO Recomendacion (id_intento, id_actividad, estado, detalle_json)
            VALUES (?, ?, 'sugerida', ?)
        """, (id_intento, actividad[0], json.dumps(recomendacion, ensure_ascii=False)))
    return recomendacion


def obtener_retroalimentacion_alumno_dao(id_usuario):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT i.id_intento, e.titulo, i.fecha_envio, r.detalle_json
            FROM Recomendacion r
            JOIN Intentos i ON i.id_intento = r.id_intento
            JOIN Alumno a ON a.id_alumno = i.id_alumno
            JOIN Ejercicios_Tutor et ON et.id_ejercicio_tutor = i.id_ejercicio_tutor
            JOIN Ejercicios e ON e.id_ejercicio = et.id_ejercicio
            WHERE a.id_usuario = ? AND i.puntuacion IS NOT NULL AND r.detalle_json IS NOT NULL
            ORDER BY r.fecha_generacion DESC, r.id_recomendacion DESC
        """, (id_usuario,))
        return [{"id_intento": r[0], "titulo_ejercicio": r[1], "fecha_envio": r[2],
                 "recomendacion": json.loads(r[3])} for r in cursor.fetchall()]
    finally:
        cursor.close()
        conn.close()
