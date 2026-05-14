from Modelo.database import connect_to_database

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

def registrar_intento_dao(ejercicio_tutor_id, imagen_codificada, id_usuario):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("No se pudo conectar a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id_estatus FROM Ejercicios_Tutor WHERE id_ejercicio_tutor = ?", (ejercicio_tutor_id,))
        ejercicio = cursor.fetchone()
        
        if not ejercicio:
            raise Exception("Ejercicio no encontrado.")
        
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