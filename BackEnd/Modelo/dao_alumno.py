from Modelo.database import connect_to_database

#perfil del alumno
def actualizar_info_alumno_dao(nombre, apellido_paterno, apellido_materno, grupo, id_usuario):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("No se pudo conectar a la base de datos")
    cursor = conn.cursor()
    try:
        # 1. Actualizar campos en la tabla Usuario
        cursor.execute("""
            UPDATE Usuario 
            SET nombre = ?, apellido_paterno = ?
            WHERE id_usuario = ?
        """, (nombre, apellido_paterno, id_usuario))
        
        # 2. Actualizar campos específicos en la tabla Alumno
        cursor.execute("""
            UPDATE Alumno 
            SET apellido_materno = ?, grupo = ? 
            WHERE id_usuario = ?
        """, (apellido_materno, grupo, id_usuario))
        
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

def actualizar_password_alumno_dao(nueva_contrasena, id_usuario):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("No se pudo conectar a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE Usuario SET contrasena_cifrada = ? WHERE id_usuario = ?", (nueva_contrasena, id_usuario))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def verificar_estado_tutor_dao(id_usuario):
    
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("No se pudo conectar a la base de datos")
    cursor = conn.cursor()
    try:
        # Obtiene el estatus del tutor asociado al alumno
        cursor.execute("""
            SELECT ut.id_estatus 
            FROM Alumno a
            JOIN Tutor t ON a.id_tutor = t.id_tutor
            JOIN Usuario ut ON t.id_usuario = ut.id_usuario
            WHERE a.id_usuario = ?
        """, (id_usuario,))
        
        row = cursor.fetchone()
        return row[0] if row else None
    finally:
        cursor.close()
        conn.close()

#intentos relacionados al alumno
def registrar_intento_dao(ejercicio_tutor_id, imagen_codificada, id_usuario):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("No se pudo conectar a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id_alumno FROM Alumno WHERE id_usuario = ?", (id_usuario,))
        alumno_row = cursor.fetchone()
        
        if not alumno_row:
            raise ValueError("No se encontró el perfil de alumno asociado a este usuario.")
            
        id_alumno = alumno_row[0]

        cursor.execute("SELECT id_estatus FROM Ejercicios_Tutor WHERE id_ejercicio_tutor = ?", (ejercicio_tutor_id,))
        ejercicio = cursor.fetchone()
        
        if not ejercicio:
            raise ValueError("Ejercicio no encontrado.")
        
        cursor.execute("""
            INSERT INTO Intentos (id_alumno, id_ejercicio_tutor, imagen_codificada)
            VALUES (?, ?, ?)
        """, (id_alumno, ejercicio_tutor_id, imagen_codificada))
        
        conn.commit()
        
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()

#ejercicios relacionados al alumno
def obtener_ejercicios_proximos_dao(id_usuario):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        query = """
            SELECT 
                et.id_ejercicio_tutor, 
                e.id_ejercicio, 
                e.titulo, 
                e.descripcion, 
                e.tipo, 
                e.contenido_base, 
                et.fecha_desactivacion as fecha_fin
            FROM Ejercicios_Tutor et
            JOIN Ejercicios e ON et.id_ejercicio = e.id_ejercicio
            JOIN Alumno a ON a.id_tutor = et.id_tutor
            WHERE a.id_usuario = ?
              AND et.id_estatus = 1
              AND et.id_ejercicio_tutor NOT IN (
                  SELECT id_ejercicio_tutor FROM Intentos WHERE id_alumno = a.id_alumno
              )
        """
        cursor.execute(query, (id_usuario,))
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
    finally:
        cursor.close()
        conn.close()


def obtener_ejercicios_completados_dao(id_usuario):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        query = """
            WITH UltimosIntentos AS (
                SELECT 
                    i.id_ejercicio_tutor,
                    i.fecha_envio,
                    i.imagen_codificada,
                    i.texto_detectado_ocr,
                    i.puntuacion,         
                    i.retroalimentacion,  
                    ROW_NUMBER() OVER(PARTITION BY i.id_ejercicio_tutor ORDER BY i.fecha_envio DESC) as rn
                FROM Intentos i
                JOIN Alumno a ON i.id_alumno = a.id_alumno
                WHERE a.id_usuario = ?
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
        """
        cursor.execute(query, (id_usuario,))
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
    finally:
        cursor.close()
        conn.close()


def obtener_ejercicios_vencidos_dao(id_usuario):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        query = """
            SELECT
                et.id_ejercicio_tutor, 
                e.id_ejercicio, 
                e.titulo,
                e.descripcion, 
                e.tipo, 
                et.fecha_desactivacion
            FROM Ejercicios_Tutor et
            JOIN Ejercicios e ON et.id_ejercicio = e.id_ejercicio
            JOIN Alumno a ON a.id_tutor = et.id_tutor
            WHERE a.id_usuario = ?
              AND et.id_estatus = 2
              AND et.id_ejercicio_tutor NOT IN (
                  SELECT id_ejercicio_tutor FROM Intentos WHERE id_alumno = a.id_alumno
              )
        """
        cursor.execute(query, (id_usuario,))
        rows = cursor.fetchall()
        
        return [
            {
                "id_ejercicio_tutor":   r[0],
                "id_ejercicio":         r[1],
                "titulo":               r[2],
                "descripcion":          r[3],
                "tipo":                 r[4],
                "fecha_desactivacion":  r[5],
            }
            for r in rows
        ]
    finally:
        cursor.close()
        conn.close()