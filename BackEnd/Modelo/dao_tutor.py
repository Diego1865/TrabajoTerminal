from Modelo.database import connect_to_database

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

        # 2. Insertar en Alumno (perfil específico)
        query_alumno = """
            INSERT INTO Alumno (id_usuario, id_tutor, apellido_materno, grado, grupo)
            VALUES (?, ?, ?, ?, ?)
        """
        cursor.execute(query_alumno, (
            id_usuario, 
            alumno_data.id_tutor, 
            alumno_data.apellido_materno, 
            alumno_data.grado, 
            alumno_data.grupo
        ))

        cursor.execute("INSERT INTO Progreso_Alumno (id_alumno) SELECT id_alumno FROM Alumno WHERE id_usuario = ?", (id_usuario,))
        
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
            WHERE a.id_tutor = ? AND u.id_estatus = 1
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
    cursor = conn.cursor()
    try:
        # Validar que el alumno pertenece al tutor
        cursor.execute("SELECT id_usuario FROM Alumno WHERE id_alumno = ? AND id_tutor = ?", (id_alumno, id_tutor))
        row = cursor.fetchone()
        if not row:
            raise PermissionError("Alumno no encontrado o no pertenece a este tutor.")

        # Actualizar estatus en la tabla Usuario
        cursor.execute("UPDATE Usuario SET id_estatus = 2 WHERE id_usuario = ?", (row[0],))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def obtener_alumnos_en_riesgo_dao(id_tutor):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        query = """
            WITH PromedialidadAlumnos AS (
                SELECT a.id_alumno, u.nombre, u.apellido_paterno, a.apellido_materno, 
                    p.promedio_ortografia,
                    (p.alineacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4 AS promedio_legibilidad,
                    (p.promedio_ortografia + (p.alineacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4) / 2 AS promedio_general
                FROM Alumno a
                JOIN Usuario u ON a.id_usuario = u.id_usuario
                JOIN Progreso_Alumno p ON a.id_alumno = p.id_alumno
                WHERE a.id_tutor = ?
            )
            SELECT *
            FROM PromedialidadAlumnos
            WHERE promedio_general < 6.0;
        """
        # Corrección de la tupla aplicada aquí
        cursor.execute(query, (id_tutor,))
        rows = cursor.fetchall()

        alumnos_en_riesgo = []
        for row in rows:
            alumnos_en_riesgo.append({
                "id_alumno": row[0],
                "nombre": row[1],
                "apellido_paterno": row[2],
                "apellido_materno": row[3],
                "promedio_ortografia": row[4],
                "promedio_legibilidad": row[5],
                "promedio_general": row[6]
            })

        return alumnos_en_riesgo
    finally:
        cursor.close()
        conn.close()

def obtener_alumnos_regular_dao(id_tutor):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        query = """
            WITH PromedialidadAlumnos AS (
                SELECT a.id_alumno, u.nombre, u.apellido_paterno, a.apellido_materno, 
                    p.promedio_ortografia,
                    (p.alineacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4 AS promedio_legibilidad,
                    (p.promedio_ortografia + (p.alineacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4) / 2 AS promedio_general
                FROM Alumno a
                JOIN Usuario u ON a.id_usuario = u.id_usuario
                JOIN Progreso_Alumno p ON a.id_alumno = p.id_alumno
                WHERE a.id_tutor = ?
            )
            SELECT *
            FROM PromedialidadAlumnos
            where promedio_general >= 6.0
            and promedio_general <= 8.0;
        """
        cursor.execute(query, (id_tutor,))
        rows = cursor.fetchall()

        alumnos_regulares = []
        for row in rows:
            alumnos_regulares.append({
                "id_alumno": row[0],
                "nombre": row[1],
                "apellido_paterno": row[2],
                "apellido_materno": row[3],
                "promedio_ortografia": row[4],
                "promedio_legibilidad": row[5],
                "promedio_general": row[6]
            })

        return alumnos_regulares
    finally:
        cursor.close()
        conn.close()

def obtener_alumnos_excelencia_dao(id_tutor):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        query = """
            WITH PromedialidadAlumnos AS (
                SELECT a.id_alumno, u.nombre, u.apellido_paterno, a.apellido_materno, 
                    p.promedio_ortografia,
                    (p.alineacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4 AS promedio_legibilidad,
                    (p.promedio_ortografia + (p.alineacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4) / 2 AS promedio_general
                FROM Alumno a
                JOIN Usuario u ON a.id_usuario = u.id_usuario
                JOIN Progreso_Alumno p ON a.id_alumno = p.id_alumno
                WHERE a.id_tutor = ?
            )
            SELECT *
            FROM PromedialidadAlumnos
            where promedio_general > 8.0;
        """
        cursor.execute(query, (id_tutor,))
        rows = cursor.fetchall()

        alumnos_excelencia = []
        for row in rows:
            alumnos_excelencia.append({
                "id_alumno": row[0],
                "nombre": row[1],
                "apellido_paterno": row[2],
                "apellido_materno": row[3],
                "promedio_ortografia": row[4],
                "promedio_legibilidad": row[5],
                "promedio_general": row[6]
            })

        return alumnos_excelencia
    finally:
        cursor.close()
        conn.close()


def obtener_progreso_grafico_dao(id_tutor):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        # Corrección: Uso de la tabla Alumno (a) y Progreso_Alumno (p) mediante id_alumno
        query1 = """
            SELECT 
                CASE 
                    WHEN p.promedio_ortografia > 8 THEN 'Buen Promedio'
                    WHEN p.promedio_ortografia BETWEEN 6 AND 8 THEN 'Promedio Regular'
                    ELSE 'Mal Promedio'
                END AS categoria,
                COUNT(DISTINCT p.id_alumno) AS cantidad_alumnos
            FROM Alumno a
                JOIN Progreso_Alumno p ON a.id_alumno = p.id_alumno
            WHERE a.id_tutor = ?
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

        # Corrección: Uso de la tabla Alumno y cálculo de promedios
        query2 = """
            WITH ProgresoLegibilidad AS (
                SELECT
                    (p.alineacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4 AS promedio_legibilidad
                FROM Alumno a
                JOIN Progreso_Alumno p ON a.id_alumno = p.id_alumno
                WHERE a.id_tutor = ?
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
            
        return {
            "ortografia": progreso_ortografico,
            "legibilidad": progreso_legibilidad
        }
    finally:
        cursor.close()
        conn.close()

#Perfil del tutor
def actualizar_nombre_tutor_dao(nombre, id_usuario):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE Usuario SET nombre = ? WHERE id_usuario = ?", (nombre, id_usuario))
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

def eliminar_cuenta_tutor(id_usuario):
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

def calificar_intento_dao(id_intento, calificacion, retroalimentacion):
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
        
        conn.commit()
    finally:
        cursor.close()
        conn.close()

def obtener_intentos_por_tutor_dao(id_usuario_tutor):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        query = """
            SELECT 
                i.id_intento, 
                a.id_alumno, -- ¡Cambiado! Ahora enviamos el id_alumno
                LTRIM(RTRIM(CONCAT(u.nombre, ' ', u.apellido_paterno, ' ', ISNULL(a.apellido_materno, '')))) AS nombre_completo,
                i.id_ejercicio_tutor, 
                e.titulo, 
                i.fecha_envio, 
                i.imagen_codificada,
                i.texto_detectado_ocr,
                i.puntuacion,        
                i.retroalimentacion  
            FROM Intentos i
            JOIN Alumno a ON i.id_alumno = a.id_alumno
            JOIN Usuario u ON a.id_usuario = u.id_usuario
            JOIN Tutor t ON a.id_tutor = t.id_tutor
            JOIN Ejercicios_Tutor et ON i.id_ejercicio_tutor = et.id_ejercicio_tutor
            JOIN Ejercicios e ON et.id_ejercicio = e.id_ejercicio
            WHERE t.id_usuario = ?
            ORDER BY i.fecha_envio DESC
        """
        cursor.execute(query, (id_usuario_tutor,))
        rows = cursor.fetchall()

        intentos = []
        for row in rows:
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
                "retroalimentacion": row[9]
            })

        return intentos
    finally:
        cursor.close()
        conn.close()

#ejercicios relacionados al tutor
def get_ejercicios_dao():
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
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
            SELECT et.id_ejercicio_tutor, e.id_ejercicio, e.titulo, e.descripcion, e.tipo
            FROM Ejercicios_Tutor et
            JOIN Ejercicios e ON et.id_ejercicio = e.id_ejercicio
            JOIN Tutor t ON et.id_tutor = t.id_tutor
            WHERE t.id_usuario = ? AND et.id_estatus = 1
        """, (id_usuario,))
        
        rows = cursor.fetchall()
        return [
            {
                "id_ejercicio_tutor": row[0],
                "id_ejercicio": row[1],
                "titulo": row[2],
                "descripcion": row[3],
                "tipo": row[4],
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
            SELECT id_ejercicio_tutor FROM Ejercicios_Tutor
            WHERE id_ejercicio = ? AND id_tutor = ? AND id_estatus = 1
        """, (id_ejercicio, id_tutor))
        
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