from Modelo.database import connect_to_database

def registrar_alumno_dao(alumno_data, hashed_password):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        # Verificar si el usuario ya existe para evitar duplicados
        cursor.execute("SELECT id_usuario FROM Usuario WHERE username = ?", alumno_data.usuario)
        if cursor.fetchone():
            raise ValueError("El nombre de usuario del alumno ya está en uso")
        
        query = """
            INSERT INTO Usuario 
            (nombre, apellido_paterno, apellido_materno, username, contrasena_cifrada, tipo_usuario, grado, grupo, id_tutor, id_estatus)
            VALUES (?, ?, ?, ?, ?, 'alumno', ?, ?, ?, 1)
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
            SELECT id_usuario, nombre, apellido_paterno, apellido_materno, username, grado, grupo 
            FROM Usuario 
            WHERE id_tutor = ? AND tipo_usuario = 'alumno' AND id_estatus = 1
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
    finally:
        cursor.close()
        conn.close()

def dar_de_baja_alumno_dao(id_alumno,id_tutor):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id_tutor FROM Usuario WHERE id_usuario = ? AND tipo_usuario = 'alumno'", (id_alumno,))
        row = cursor.fetchone()
        if not row:
            raise FileNotFoundError("Alumno no encontrado")
        if row[0] != id_tutor:
            raise PermissionError("No tiene permiso para dar de baja a este alumno.")

        query = "UPDATE Usuario SET id_estatus = 2 WHERE id_usuario = ?"
        cursor.execute(query, (id_alumno,))
        conn.commit()

        if cursor.rowcount == 0:
            raise FileNotFoundError("Alumno no encontrado")

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
                SELECT a.id_usuario, a.nombre, a.apellido_paterno, a.apellido_materno, 
                    p.promedio_ortografia,
                    (p.alineacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4 AS promedio_legibilidad,
                    (p.promedio_ortografia + (p.alineacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4) / 2 AS promedio_general
                FROM Usuario a
                JOIN Progreso_Alumno p ON a.id_usuario = p.id_usuario
                WHERE a.id_tutor = ? AND a.tipo_usuario = 'alumno'
            )
            SELECT *
            FROM PromedialidadAlumnos
            where promedio_general < 6.0;
           
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
                SELECT a.id_usuario, a.nombre, a.apellido_paterno, a.apellido_materno, 
                    p.promedio_ortografia,
                    (p.alineacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4 AS promedio_legibilidad,
                    (p.promedio_ortografia + (p.alineacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4) / 2 AS promedio_general
                FROM Usuario a
                JOIN Progreso_Alumno p ON a.id_usuario = p.id_usuario
                WHERE a.id_tutor = ? AND a.tipo_usuario = 'alumno'
            )
            SELECT *
            FROM PromedialidadAlumnos
            where promedio_general >= 6.0
            and promedio_general <= 8.0;
        """
        cursor.execute(query, id_tutor)
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
                SELECT a.id_usuario, a.nombre, a.apellido_paterno, a.apellido_materno, 
                    p.promedio_ortografia,
                    (p.alineacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4 AS promedio_legibilidad,
                    (p.promedio_ortografia + (p.alineacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4) / 2 AS promedio_general
                FROM Usuario a
                JOIN Progreso_Alumno p ON a.id_usuario = p.id_usuario
                WHERE a.id_tutor = ? AND a.tipo_usuario = 'alumno'
            )
            SELECT *
            FROM PromedialidadAlumnos
            where promedio_general > 8.0;
        """
        cursor.execute(query, id_tutor)
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
        query1 = """
            SELECT 
                CASE 
                    WHEN promedio_ortografia > 8 THEN 'Buen Promedio'
                    WHEN promedio_ortografia BETWEEN 6 AND 8 THEN 'Promedio Regular'
                    ELSE 'Mal Promedio'
                END AS categoria,
                COUNT(DISTINCT p.id_usuario) AS cantidad_alumnos
            FROM Usuario a
                JOIN Progreso_Alumno p ON a.id_usuario = p.id_usuario
            WHERE a.id_tutor = ? AND a.tipo_usuario = 'alumno'
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
        query2 = """
            WITH ProgresoLegibilidad AS (
                SELECT
                    (alineacion_score + tamano_letra_score + espaciado_score + inclinacion_score) / 4 AS promedio_legibilidad
                FROM Usuario a
                JOIN Progreso_Alumno p ON a.id_usuario = p.id_usuario
                WHERE a.id_tutor = ? AND a.tipo_usuario = 'alumno'
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