from Modelo.database import connect_to_database

def login_dao(username):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        # Se agrega LEFT JOIN para recuperar id_tutor e id_alumno dependiendo del tipo de usuario
        query = """
            SELECT 
                u.id_usuario, 
                u.contrasena_cifrada, 
                u.nombre, 
                u.tipo_usuario, 
                u.id_estatus,
                t.id_tutor,
                a.id_alumno
            FROM Usuario u
            LEFT JOIN Tutor t ON u.id_usuario = t.id_usuario
            LEFT JOIN Alumno a ON u.id_usuario = a.id_usuario
            WHERE u.username = ?
        """
        cursor.execute(query, (username,))
        user = cursor.fetchone()

        if not user:
            raise ValueError("Usuario o contraseña incorrectos")

        return user
    finally:
        cursor.close()
        conn.close()

def register_dao(username, email, hashed_password, nombre, apellido):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id_usuario FROM Usuario WHERE username = ?", (username,))
        if cursor.fetchone(): 
            raise ValueError("El nombre de usuario ya está registrado")

        cursor.execute("SELECT id_tutor FROM Tutor WHERE correo = ?", (email,))
        if cursor.fetchone(): 
            raise ValueError("El correo electrónico ya está registrado")
        
        query_usuario = """
            INSERT INTO Usuario (nombre, apellido_paterno, username, contrasena_cifrada, tipo_usuario, id_estatus)
            OUTPUT INSERTED.id_usuario
            VALUES (?, ?, ?, ?, 'tutor', 1)
        """
        cursor.execute(query_usuario, (nombre, apellido, username, hashed_password))
        resultado_usuario = cursor.fetchone()
        
        if not resultado_usuario:
            raise Exception("No se pudo generar el identificador de usuario.")
            
        id_usuario_generado = resultado_usuario[0]

        query_tutor = """
            INSERT INTO Tutor (id_usuario, correo)
            VALUES (?, ?)
        """
        cursor.execute(query_tutor, (id_usuario_generado, email))
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()