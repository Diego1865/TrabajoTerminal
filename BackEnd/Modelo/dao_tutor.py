from Modelo.database import connect_to_database
from Servicios.evaluacion import cls_de_intento
from Servicios.legibilidad import medir_legibilidad
import json
from datetime import timezone


def _json(texto):
    try:
        valor = json.loads(texto) if texto else None
    except (TypeError, ValueError):
        return None
    return valor if isinstance(valor, dict) else None

MEDIDAS_LEGIBILIDAD = ("alineacion", "tamano", "espaciado", "inclinacion")

def _legibilidad_sugerida(resultado):
    """La guardada al entregar; en intentos anteriores se calcula con los recuadros (sin inclinación)."""
    if not resultado:
        return None
    if "legibilidad" in resultado:
        return resultado["legibilidad"]
    if resultado.get("estado") != "procesado":
        return None
    return medir_legibilidad(resultado.get("full_text_annotation"))

#Funciones relacionadas con el tutor y sus alumnos
def registrar_alumno_dao(alumno_data, hashed_password):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id_usuario FROM Usuario WHERE username = ?", (alumno_data.usuario,))
        if cursor.fetchone():
            raise ValueError("El nombre de usuario del alumno ya está en uso")
        
        # 1. Insertar en Usuario (nombre, apellido_paterno, auth)
        query_usuario = """
            INSERT INTO Usuario (nombre, apellido_paterno, username, contrasena_cifrada, tipo_usuario, id_estatus)
            OUTPUT INSERTED.id_usuario
            VALUES (?, ?, ?, ?, 'alumno', 1)
        """
        cursor.execute(query_usuario, (
            alumno_data.nombre, 
            alumno_data.apellido_paterno, 
            alumno_data.usuario, 
            hashed_password
        ))
        id_usuario = cursor.fetchone()[0]

        # Resolver id_tutor desde id_usuario (el frontend envía el id_usuario del tutor)
        cursor.execute("SELECT id_tutor FROM Tutor WHERE id_usuario = ?", (alumno_data.id_tutor,))
        tutor = cursor.fetchone()
        if not tutor:
            raise ValueError("Tutor no encontrado")
        id_tutor = tutor[0]

        # 2. Insertar en Alumno (perfil específico)
        query_alumno = """
            INSERT INTO Alumno (id_usuario, id_tutor, apellido_materno, grado, grupo)
            VALUES (?, ?, ?, ?, ?)
        """
        cursor.execute(query_alumno, (
            id_usuario,
            id_tutor,
            alumno_data.apellido_materno, 
            alumno_data.grado, 
            alumno_data.grupo
        ))

        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

def obtener_alumnos_por_tutor_dao(id_tutor):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        query = """
            SELECT a.id_alumno, u.nombre, u.apellido_paterno, a.apellido_materno, u.username, a.grado, a.grupo 
            FROM Alumno a
            JOIN Usuario u ON a.id_usuario = u.id_usuario
            JOIN Tutor t ON a.id_tutor = t.id_tutor
            WHERE t.id_usuario = ? AND u.id_estatus = 1
        """
        cursor.execute(query, (id_tutor,))
        rows = cursor.fetchall()
        return [{
            "id_alumno": r[0], "nombre": r[1], "apellido_paterno": r[2],
            "apellido_materno": r[3], "usuario": r[4], "grado": r[5], "grupo": r[6]
        } for r in rows]
    finally:
        cursor.close()
        conn.close()

def dar_de_baja_alumno_dao(id_alumno, id_tutor):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        # Validar que el alumno pertenece al tutor
        cursor.execute("""
            SELECT a.id_usuario
            FROM Alumno a
            JOIN Tutor t ON a.id_tutor = t.id_tutor
            WHERE a.id_alumno = ? AND t.id_usuario = ?
        """, (id_alumno, id_tutor))
        row = cursor.fetchone()
        if not row:
            raise PermissionError("Alumno no encontrado o no pertenece a este tutor.")

        # Actualizar estatus en la tabla Usuario
        cursor.execute("UPDATE Usuario SET id_estatus = 2 WHERE id_usuario = ?", (row[0],))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def _alumnos_por_rango(id_usuario_tutor, condicion):
    """Alumnos activos del tutor cuyo promedio general cumple la condición (sobre la vista)."""
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute(f"""
            SELECT p.id_alumno, p.nombre, p.apellido_paterno, p.apellido_materno,
                p.promedio_ortografia, p.promedio_legibilidad, p.promedio_general
            FROM vw_Progreso_Alumno p
            JOIN Tutor t ON t.id_tutor = p.id_tutor
            WHERE t.id_usuario = ? AND p.id_estatus = 1 AND {condicion}
        """, (id_usuario_tutor,))
        campos = ("id_alumno", "nombre", "apellido_paterno", "apellido_materno",
                  "promedio_ortografia", "promedio_legibilidad", "promedio_general")
        return [dict(zip(campos, row)) for row in cursor.fetchall()]
    finally:
        cursor.close()
        conn.close()

# Las condiciones son fijas (no vienen del cliente).
def obtener_alumnos_en_riesgo_dao(id_tutor):
    return _alumnos_por_rango(id_tutor, "p.promedio_general < 6.0")

def obtener_alumnos_regular_dao(id_tutor):
    return _alumnos_por_rango(id_tutor, "p.promedio_general >= 6.0 AND p.promedio_general <= 8.0")

def obtener_alumnos_excelencia_dao(id_tutor):
    return _alumnos_por_rango(id_tutor, "p.promedio_general > 8.0")


def obtener_progreso_grafico_dao(id_tutor):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        query1 = """
            SELECT 
                CASE 
                    WHEN p.promedio_ortografia > 8 THEN 'Buen Promedio'
                    WHEN p.promedio_ortografia BETWEEN 6 AND 8 THEN 'Promedio Regular'
                    ELSE 'Mal Promedio'
                END AS categoria,
                COUNT(DISTINCT p.id_alumno) AS cantidad_alumnos
            FROM vw_Progreso_Alumno p
                JOIN Tutor t ON p.id_tutor = t.id_tutor
            WHERE t.id_usuario = ? AND p.id_estatus = 1 AND p.promedio_ortografia IS NOT NULL
            GROUP BY
                CASE 
                    WHEN p.promedio_ortografia > 8 THEN 'Buen Promedio'
                    WHEN p.promedio_ortografia BETWEEN 6 AND 8 THEN 'Promedio Regular'
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

        query2 = """
            WITH ProgresoLegibilidad AS (
                SELECT p.promedio_legibilidad
                FROM vw_Progreso_Alumno p
                JOIN Tutor t ON p.id_tutor = t.id_tutor
                WHERE t.id_usuario = ? AND p.id_estatus = 1
            )
            SELECT
                CASE
                    WHEN promedio_legibilidad > 8 THEN 'Buena Legibilidad'
                    WHEN promedio_legibilidad BETWEEN 6 AND 8 THEN 'Legibilidad Regular'
                    ELSE 'Mala Legibilidad'
                END AS categoria,
                COUNT(*) AS cantidad_alumnos
            FROM ProgresoLegibilidad
            WHERE promedio_legibilidad IS NOT NULL
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
            
        return {
            "ortografia": progreso_ortografico,
            "legibilidad": progreso_legibilidad
        }
    finally:
        cursor.close()
        conn.close()

#Perfil del tutor
def obtener_perfil_tutor_dao(id_usuario):
    """Datos del tutor para mostrarlos en su perfil, o None si no existe."""
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT u.nombre, u.apellido_paterno, u.username, t.correo, u.fecha_registro
            FROM Usuario u
            JOIN Tutor t ON t.id_usuario = u.id_usuario
            WHERE u.id_usuario = ?
        """, (id_usuario,))
        row = cursor.fetchone()
        if not row:
            return None
        return {
            "nombre": row[0],
            "apellido_paterno": row[1],
            "usuario": row[2],
            "correo": row[3],
            "fecha_registro": row[4],
        }
    finally:
        cursor.close()
        conn.close()

def actualizar_nombre_tutor_dao(nombre, apellido_paterno, id_usuario):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE Usuario SET nombre = ?, apellido_paterno = ? WHERE id_usuario = ?",
                       (nombre, apellido_paterno, id_usuario))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def actualizar_correo_tutor_dao(id_usuario, nuevo_correo):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        # Se actualiza en la tabla Tutor según el esquema normalizado
        cursor.execute("UPDATE Tutor SET correo = ? WHERE id_usuario = ?", (nuevo_correo, id_usuario))
        
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

def correo_en_uso_dao(correo, id_usuario):
    """True si otro tutor ya usa ese correo."""
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT 1 FROM Tutor WHERE LOWER(correo) = ? AND id_usuario <> ?", (correo, id_usuario))
        return cursor.fetchone() is not None
    finally:
        cursor.close()
        conn.close()

def restablecer_password_alumno_dao(id_alumno, id_usuario_tutor, hashed_password):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        # Solo el tutor a cargo puede cambiar la contraseña del alumno
        cursor.execute("""
            SELECT a.id_usuario
            FROM Alumno a
            JOIN Tutor t ON a.id_tutor = t.id_tutor
            WHERE a.id_alumno = ? AND t.id_usuario = ?
        """, (id_alumno, id_usuario_tutor))
        row = cursor.fetchone()
        if not row:
            raise PermissionError("Alumno no encontrado o no pertenece a este tutor.")
        cursor.execute("UPDATE Usuario SET contrasena_cifrada = ? WHERE id_usuario = ?", (hashed_password, row[0]))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def actualizar_password_tutor_dao(nueva_contrasena, id_usuario):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE Usuario SET contrasena_cifrada = ? WHERE id_usuario = ?", (nueva_contrasena, id_usuario))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def eliminar_cuenta_tutor_dao(id_usuario):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        # Cambiar estatus a 3 (eliminado) o 2 (inactivo)
        cursor.execute("UPDATE Usuario SET id_estatus = 3 WHERE id_usuario = ?", (id_usuario,))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

#Intentos relacionados al tutor
def obtener_intento_tutor_dao(id_intento, id_usuario_tutor):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        # Se hace JOIN con Alumno y Tutor para validar los permisos
        cursor.execute("""
            SELECT i.id_intento
            FROM Intentos i
            JOIN Alumno a ON i.id_alumno = a.id_alumno
            JOIN Tutor t ON a.id_tutor = t.id_tutor
            WHERE i.id_intento = ? AND t.id_usuario = ?
        """, (id_intento, id_usuario_tutor))
        
        row = cursor.fetchone()
        if not row:
            raise PermissionError("No tiene permiso para acceder a este intento o no existe.")
        
        return True
    finally:
        cursor.close()
        conn.close()

def calificar_intento_dao(id_intento, calificacion, retroalimentacion, cls_correctas=None, legibilidad=None):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE Intentos
            SET puntuacion = ?, retroalimentacion = ?
            WHERE id_intento = ?
        """, (calificacion, retroalimentacion, id_intento))

        cursor.execute("""
            SELECT i.id_alumno, i.resultado_ocr_json, i.texto_detectado_ocr, e.contenido_base
            FROM Intentos i
            JOIN Ejercicios_Tutor et ON et.id_ejercicio_tutor = i.id_ejercicio_tutor
            JOIN Ejercicios e ON e.id_ejercicio = et.id_ejercicio
            WHERE i.id_intento = ?
        """, (id_intento,))
        _, resultado, texto, contenido = cursor.fetchone()

        if cls_correctas is not None:
            # CLS confirmado por el tutor: las posibles las fija la respuesta esperada (no el cliente).
            # Se guarda en columnas existentes de Analisis_Ortografico y actualiza el promedio del alumno.
            sugerido = cls_de_intento(_json(contenido), texto, (_json(resultado) or {}).get("evaluacion_preliminar"))
            if not sugerido or not sugerido.get("posibles"):
                raise ValueError("Este ejercicio no tiene respuesta configurada; no se puede registrar el CLS.")
            cls_posibles = sugerido["posibles"]
            if not 0 <= cls_correctas <= cls_posibles:
                raise ValueError(f"Las secuencias correctas deben estar entre 0 y {cls_posibles}.")
            sugerido = {k: sugerido.get(k) for k in ("correctas", "posibles", "puntaje_sugerido")}
            detalle = json.dumps({"metrica": "CLS", "correctas": cls_correctas, "posibles": cls_posibles,
                                  "sugerido": sugerido, "confirmado_por_tutor": True}, ensure_ascii=False)
            puntaje = round(cls_correctas / cls_posibles * 10, 2)
            cursor.execute("""
                MERGE Analisis_Ortografico AS destino
                USING (SELECT ? AS id_intento) AS origen ON destino.id_intento = origen.id_intento
                WHEN MATCHED THEN UPDATE SET ortografia_score = ?, cantidad_errores = ?, sugerencias_json = ?
                WHEN NOT MATCHED THEN INSERT (id_intento, ortografia_score, cantidad_errores, sugerencias_json)
                    VALUES (origen.id_intento, ?, ?, ?);
            """, (id_intento, puntaje, cls_posibles - cls_correctas, detalle,
                  puntaje, cls_posibles - cls_correctas, detalle))

        if legibilidad is not None:
            # Legibilidad confirmada (o corregida) por el tutor; las 4 medidas van de 0 a 10.
            detalle = json.dumps({"metrica": "legibilidad", "confirmado_por_tutor": True,
                                  "sugerido": _legibilidad_sugerida(_json(resultado))}, ensure_ascii=False)
            valores = [legibilidad[m] for m in MEDIDAS_LEGIBILIDAD]
            cursor.execute("""
                MERGE Analisis_Caligrafico AS destino
                USING (SELECT ? AS id_intento) AS origen ON destino.id_intento = origen.id_intento
                WHEN MATCHED THEN UPDATE SET alineacion_score = ?, tamano_letra_score = ?,
                    espaciado_score = ?, inclinacion_score = ?, observaciones = ?
                WHEN NOT MATCHED THEN INSERT (id_intento, alineacion_score, tamano_letra_score,
                    espaciado_score, inclinacion_score, observaciones)
                    VALUES (origen.id_intento, ?, ?, ?, ?, ?);
            """, (id_intento, *valores, detalle, *valores, detalle))

        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

def _consultar_intentos(cursor, id_usuario_tutor, id_alumno=None, con_imagen=True):
    """Intentos de los alumnos del tutor, del más reciente al más antiguo.

    Con id_alumno solo los de ese alumno. Sin imagen la respuesta pesa mucho menos:
    la imagen se pide aparte, solo del intento que se revisa.
    """
    filtro_alumno = "AND a.id_alumno = ?" if id_alumno is not None else ""
    imagen = "i.imagen_codificada" if con_imagen else "NULL"
    cursor.execute(f"""
        SELECT
            i.id_intento,
            a.id_alumno,
            LTRIM(RTRIM(CONCAT(u.nombre, ' ', u.apellido_paterno, ' ', ISNULL(a.apellido_materno, '')))) AS nombre_completo,
            i.id_ejercicio_tutor,
            e.titulo,
            i.fecha_envio,
            {imagen} AS imagen_codificada,
            i.texto_detectado_ocr,
            i.puntuacion,
            i.retroalimentacion,
            i.resultado_ocr_json,
            ao.sugerencias_json,
            e.contenido_base,
            ac.alineacion_score,
            ac.tamano_letra_score,
            ac.espaciado_score,
            ac.inclinacion_score
        FROM Intentos i
        LEFT JOIN Analisis_Ortografico ao ON ao.id_intento = i.id_intento
        LEFT JOIN Analisis_Caligrafico ac ON ac.id_intento = i.id_intento
        JOIN Alumno a ON i.id_alumno = a.id_alumno
        JOIN Usuario u ON a.id_usuario = u.id_usuario
        JOIN Tutor t ON a.id_tutor = t.id_tutor
        JOIN Ejercicios_Tutor et ON i.id_ejercicio_tutor = et.id_ejercicio_tutor
        JOIN Ejercicios e ON et.id_ejercicio = e.id_ejercicio
        WHERE t.id_usuario = ? {filtro_alumno}
        ORDER BY i.fecha_envio DESC
    """, (id_usuario_tutor, id_alumno) if id_alumno is not None else (id_usuario_tutor,))

    intentos = []
    for row in cursor.fetchall():
        resultado = _json(row[10]) or {}
        evaluacion = resultado.get("evaluacion_preliminar")
        confirmada = None if row[13] is None else {m: float(v) for m, v in zip(MEDIDAS_LEGIBILIDAD, row[13:17])}
        intentos.append({
            "id_intento": row[0],
            "id_alumno": row[1],
            "nombre_completo": row[2],
            "id_ejercicio_tutor": row[3],
            "titulo_ejercicio": row[4],
            "fecha_envio": row[5],
            "imagen_codificada": row[6],
            "texto_detectado_ocr": row[7],
            "puntuacion": row[8],
            "retroalimentacion": row[9],
            "evaluacion_preliminar": evaluacion,
            "cls_confirmado": _json(row[11]),
            "cls_sugerido": cls_de_intento(_json(row[12]), row[7], evaluacion),
            "legibilidad_confirmada": confirmada,
            "legibilidad_sugerida": _legibilidad_sugerida(resultado)
        })
    return intentos

def obtener_intentos_por_tutor_dao(id_usuario_tutor):
    """Todos los intentos de todos sus alumnos, con imagen (ruta anterior, se conserva)."""
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        return _consultar_intentos(cursor, id_usuario_tutor)
    finally:
        cursor.close()
        conn.close()

def obtener_intentos_alumno_dao(id_alumno, id_usuario_tutor):
    """Intentos de un alumno del tutor, sin imagen. PermissionError si el alumno no es suyo."""
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT 1 FROM Alumno a JOIN Tutor t ON t.id_tutor = a.id_tutor
            WHERE a.id_alumno = ? AND t.id_usuario = ?
        """, (id_alumno, id_usuario_tutor))
        if not cursor.fetchone():
            raise PermissionError("No tiene permiso para ver a este alumno o no existe.")
        return _consultar_intentos(cursor, id_usuario_tutor, id_alumno=id_alumno, con_imagen=False)
    finally:
        cursor.close()
        conn.close()

def obtener_imagen_intento_dao(id_intento, id_usuario_tutor):
    """Imagen de un intento de un alumno del tutor. PermissionError si no es suyo o no existe."""
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT i.imagen_codificada
            FROM Intentos i
            JOIN Alumno a ON i.id_alumno = a.id_alumno
            JOIN Tutor t ON a.id_tutor = t.id_tutor
            WHERE i.id_intento = ? AND t.id_usuario = ?
        """, (id_intento, id_usuario_tutor))
        row = cursor.fetchone()
        if not row:
            raise PermissionError("No tiene permiso para acceder a este intento o no existe.")
        return row[0]
    finally:
        cursor.close()
        conn.close()

#ejercicios relacionados al tutor
def crear_dictado_dao(data, id_usuario):
    from Servicios.dictado import contenido_dictado, fecha_limite_utc

    contenido = contenido_dictado(data.palabras)
    fecha_fin = fecha_limite_utc(data.fecha_fin)
    descripcion = (f"Escucha y escribe las {len(contenido['dictado']['palabras'])} palabras "
                   "en el orden del dictado, sin numerarlas. Puedes repetir cada palabra.")
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id_tutor FROM Tutor WHERE id_usuario = ?", (id_usuario,))
        tutor = cursor.fetchone()
        if not tutor:
            raise ValueError("El perfil de tutor no existe para este usuario.")
        cursor.execute("""
            INSERT INTO Ejercicios (titulo, descripcion, tipo, contenido_base, id_tutor_creador)
            OUTPUT INSERTED.id_ejercicio
            VALUES (?, ?, 'dictado', ?, ?)
        """, (data.titulo, descripcion, json.dumps(contenido, ensure_ascii=True), tutor[0]))
        id_ejercicio = cursor.fetchone()[0]
        cursor.execute("""
            INSERT INTO Ejercicios_Tutor (id_ejercicio, id_tutor, fecha_desactivacion)
            OUTPUT INSERTED.id_ejercicio_tutor
            VALUES (?, ?, ?)
        """, (id_ejercicio, tutor[0], fecha_fin))
        id_asignacion = cursor.fetchone()[0]
        conn.commit()
        return {"id_ejercicio": id_ejercicio, "id_ejercicio_tutor": id_asignacion,
                "titulo": data.titulo, "descripcion": descripcion, "tipo": "dictado",
                "contenido_base": json.dumps(contenido, ensure_ascii=False),
                "fecha_fin": data.fecha_fin}
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()


def get_ejercicios_dao(id_usuario):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT id_ejercicio, titulo, descripcion, tipo, contenido_base
            FROM Ejercicios
            WHERE id_estatus = 1 AND (id_tutor_creador IS NULL OR
                id_tutor_creador IN (SELECT id_tutor FROM Tutor WHERE id_usuario = ?))
        """, (id_usuario,))
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
    finally:
        cursor.close()
        conn.close()

def get_ejercicios_tutor_dao(id_usuario):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        # Se añade el JOIN con la tabla Tutor para validar el id_usuario
        cursor.execute("""
            SELECT et.id_ejercicio_tutor, e.id_ejercicio, e.titulo, e.descripcion, e.tipo, et.fecha_desactivacion
            FROM Ejercicios_Tutor et
            JOIN Ejercicios e ON et.id_ejercicio = e.id_ejercicio
            JOIN Tutor t ON et.id_tutor = t.id_tutor
            WHERE t.id_usuario = ? AND et.id_estatus = 1
              AND (e.tipo <> 'dictado' OR et.fecha_desactivacion IS NULL
                   OR et.fecha_desactivacion > SYSUTCDATETIME())
        """, (id_usuario,))
        
        rows = cursor.fetchall()
        return [
            {
                "id_ejercicio_tutor": row[0],
                "id_ejercicio": row[1],
                "titulo": row[2],
                "descripcion": row[3],
                "tipo": row[4],
                "fecha_fin": row[5].replace(tzinfo=timezone.utc) if row[4] == 'dictado' and row[5] else row[5],
            }
            for row in rows
        ]
    finally:
        cursor.close()
        conn.close()

def activar_ejercicio_tutor_dao(id_ejercicio, id_usuario, fecha_fin):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        # Resolver id_tutor desde id_usuario
        cursor.execute("SELECT id_tutor FROM Tutor WHERE id_usuario = ?", (id_usuario,))
        tutor = cursor.fetchone()
        if not tutor:
            raise ValueError("El perfil de tutor no existe para este usuario")
        id_tutor = tutor[0]

        # Verificar duplicados activos
        cursor.execute("""
            SELECT tipo FROM Ejercicios
            WHERE id_ejercicio = ? AND id_estatus = 1
              AND (id_tutor_creador IS NULL OR id_tutor_creador = ?)
        """, (id_ejercicio, id_tutor))
        ejercicio = cursor.fetchone()
        if not ejercicio:
            raise ValueError("El ejercicio no existe o no pertenece a este tutor.")
        if ejercicio[0] == 'dictado':
            from Servicios.dictado import fecha_limite_utc
            fecha_fin = fecha_limite_utc(fecha_fin)

        cursor.execute("""
            SELECT id_ejercicio_tutor FROM Ejercicios_Tutor
            WHERE id_ejercicio = ? AND id_tutor = ? AND id_estatus = 1
              AND (? <> 'dictado' OR fecha_desactivacion IS NULL OR fecha_desactivacion > SYSUTCDATETIME())
        """, (id_ejercicio, id_tutor, ejercicio[0]))
        
        if cursor.fetchone():
            raise ValueError("El ejercicio ya se encuentra activado")

        # Inserción con el identificador de la tabla Tutor
        cursor.execute("""
            INSERT INTO Ejercicios_Tutor (id_ejercicio, id_tutor, id_estatus, fecha_desactivacion)
            VALUES (?, ?, 1, ?)
        """, (id_ejercicio, id_tutor, fecha_fin))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def desactivar_ejercicio_tutor_dao(id_usuario, id_ejercicio):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id_tutor FROM Tutor WHERE id_usuario = ?", (id_usuario,))
        tutor = cursor.fetchone()
        if not tutor:
            raise ValueError("Tutor no encontrado")
        id_tutor = tutor[0]

        cursor.execute("""
            UPDATE Ejercicios_Tutor SET id_estatus = 2
            WHERE id_tutor = ? AND id_ejercicio = ? AND id_estatus = 1
        """, (id_tutor, id_ejercicio))
        
        if cursor.rowcount == 0:
            raise ValueError("Ejercicio no encontrado o ya se encuentra desactivado")
        conn.commit()
    finally:
        cursor.close()
        conn.close()
