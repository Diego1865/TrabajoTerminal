"""Recomendaciones independientes de Ejercicios y Ejercicios_Tutor."""
import json
from datetime import timezone

from Modelo.database import connect_to_database
from Servicios.retroalimentacion import crear_recomendacion, adaptar_recomendacion


def guardar_recomendacion(cursor, id_intento, id_alumno, contenido):
    """Se ejecuta dentro de la transacción que confirma las notas del intento.

    El UPDATE previo de Intentos serializa las recalificaciones del mismo intento.
    Solo se reemplazan recomendaciones que aún no tienen una práctica entregada.
    """
    cursor.execute("""
        SELECT TOP (1) detalle_json FROM Recomendacion
        WHERE id_intento = ? AND fecha_completada IS NOT NULL
        ORDER BY id_recomendacion DESC
    """, (id_intento,))
    completada = cursor.fetchone()
    if completada:
        return adaptar_recomendacion(json.loads(completada[0]), id_intento)

    cursor.execute("""
        SELECT promedio_ortografia, promedio_legibilidad
        FROM vw_Progreso_Alumno WHERE id_alumno = ?
    """, (id_alumno,))
    promedios = cursor.fetchone()
    recomendacion = crear_recomendacion(*promedios, contenido, semilla=id_intento) if promedios else None
    cursor.execute("""
        DELETE FROM Recomendacion
        WHERE id_intento = ? AND detalle_json IS NOT NULL AND fecha_completada IS NULL
    """, (id_intento,))
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
            SELECT i.id_intento, e.titulo, i.fecha_envio, r.detalle_json,
                   r.id_recomendacion, r.estado, r.fecha_completada, r.fecha_validada
            FROM Recomendacion r
            JOIN Intentos i ON i.id_intento = r.id_intento
            JOIN Alumno a ON a.id_alumno = i.id_alumno
            JOIN Ejercicios_Tutor et ON et.id_ejercicio_tutor = i.id_ejercicio_tutor
            JOIN Ejercicios e ON e.id_ejercicio = et.id_ejercicio
            WHERE a.id_usuario = ? AND i.puntuacion IS NOT NULL AND r.detalle_json IS NOT NULL
            ORDER BY r.fecha_generacion DESC, r.id_recomendacion DESC
        """, (id_usuario,))
        return [{"id_intento": r[0], "titulo_ejercicio": r[1], "fecha_envio": r[2],
                 "recomendacion": adaptar_recomendacion(json.loads(r[3]), r[0]),
                 "practica": _resumen_practica(r[4:8])} for r in cursor.fetchall()]
    finally:
        cursor.close()
        conn.close()


def obtener_recomendacion_intento_dao(id_intento, id_usuario, rol):
    """Solo permite descargar al alumno dueño del intento o a su tutor actual."""
    if rol not in ("alumno", "tutor"):
        raise PermissionError("Rol no permitido")
    filtro = "a.id_usuario = ?" if rol == "alumno" else "t.id_usuario = ?"
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute(f"""
            SELECT TOP (1) r.detalle_json
            FROM Recomendacion r
            JOIN Intentos i ON i.id_intento = r.id_intento
            JOIN Alumno a ON a.id_alumno = i.id_alumno
            JOIN Tutor t ON t.id_tutor = a.id_tutor
            WHERE i.id_intento = ? AND {filtro}
                AND i.puntuacion IS NOT NULL AND r.detalle_json IS NOT NULL
            ORDER BY r.id_recomendacion DESC
        """, (id_intento, id_usuario))
        fila = cursor.fetchone()
        recomendacion = adaptar_recomendacion(json.loads(fila[0]), id_intento) if fila else None
        if not recomendacion:
            # La misma respuesta para una recomendación ausente o de otra persona.
            raise FileNotFoundError("No se encontró una recomendación disponible para este intento")
        return recomendacion
    finally:
        cursor.close()
        conn.close()


def _resumen_practica(fila):
    id_recomendacion, estado, completada, validada = fila
    return {
        "id_recomendacion": id_recomendacion,
        "estado": estado,
        "fecha_completada": completada.replace(tzinfo=timezone.utc) if completada else None,
        "fecha_validada": validada.replace(tzinfo=timezone.utc) if validada else None,
    }


def _practica_del_usuario(cursor, id_intento, id_usuario, rol, *, bloquear=False, incluir_imagen=False):
    # Las escrituras toman el mismo bloqueo del intento que usa la recalificación.
    bloqueo = "WITH (UPDLOCK)" if bloquear else ""
    campo_usuario = "a.id_usuario" if rol == "alumno" else "t.id_usuario"
    cursor.execute(f"""
        SELECT t.id_tutor FROM Intentos i {bloqueo}
        JOIN Alumno a ON a.id_alumno = i.id_alumno
        JOIN Tutor t ON t.id_tutor = a.id_tutor
        WHERE i.id_intento = ? AND {campo_usuario} = ? AND i.puntuacion IS NOT NULL
    """, (id_intento, id_usuario))
    tutor = cursor.fetchone()
    if not tutor:
        raise FileNotFoundError("No se encontró una práctica disponible para este intento.")

    imagen = ", imagen_practica" if incluir_imagen else ""
    cursor.execute(f"""
        SELECT TOP (1) id_recomendacion, estado, fecha_completada, fecha_validada {imagen}
        FROM Recomendacion WHERE id_intento = ? AND detalle_json IS NOT NULL
        ORDER BY id_recomendacion DESC
    """, (id_intento,))
    fila = cursor.fetchone()
    if not fila:
        raise FileNotFoundError("No se encontró una práctica disponible para este intento.")

    practica = _resumen_practica(fila[:4])
    if incluir_imagen:
        practica["imagen_codificada"] = fila[4]
    return tutor[0], practica


def obtener_practica_tutor_dao(id_intento, id_usuario, incluir_imagen=False):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        return _practica_del_usuario(
            cursor, id_intento, id_usuario, "tutor", incluir_imagen=incluir_imagen
        )[1]
    finally:
        cursor.close()
        conn.close()


def actualizar_practica_dao(id_intento, id_recomendacion, id_usuario, rol, imagen=None):
    """Registra la entrega del alumno o la confirmación de su tutor."""
    if rol not in ("alumno", "tutor"):
        raise PermissionError("Rol no permitido")
    if rol == "alumno" and not imagen:
        raise ValueError("Adjunta una imagen de la práctica.")
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        id_tutor, practica = _practica_del_usuario(
            cursor, id_intento, id_usuario, rol, bloquear=True
        )
        if practica["id_recomendacion"] != id_recomendacion:
            raise ValueError("La recomendación cambió. Recarga la página para ver la ficha actual.")

        if rol == "alumno" and practica["estado"] == "sugerida":
            cursor.execute("""
                UPDATE Recomendacion
                SET estado = 'completada', imagen_practica = ?, fecha_completada = SYSUTCDATETIME()
                OUTPUT inserted.id_recomendacion, inserted.estado,
                       inserted.fecha_completada, inserted.fecha_validada
                WHERE id_recomendacion = ?
            """, (imagen, id_recomendacion))
            practica = _resumen_practica(cursor.fetchone())
        elif rol == "tutor" and practica["estado"] == "completada":
            cursor.execute("""
                UPDATE Recomendacion
                SET estado = 'validada', id_tutor_validador = ?, fecha_validada = SYSUTCDATETIME()
                OUTPUT inserted.id_recomendacion, inserted.estado,
                       inserted.fecha_completada, inserted.fecha_validada
                WHERE id_recomendacion = ?
            """, (id_tutor, id_recomendacion))
            practica = _resumen_practica(cursor.fetchone())
        elif rol == "tutor" and practica["estado"] != "validada":
            raise ValueError("El alumno aún no ha entregado la práctica.")

        conn.commit()
        return practica
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()
