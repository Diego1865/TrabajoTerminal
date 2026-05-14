from Modelo.database import connect_to_database

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