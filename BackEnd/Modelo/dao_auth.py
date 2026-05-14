from Modelo.database import connect_to_database

def login_dao(username):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        # Consulta unificada a la tabla Usuario
        query = """
            SELECT id_usuario, contrasena_cifrada, nombre, tipo_usuario, id_estatus 
            FROM Usuario
            WHERE username = ?
        """
        cursor.execute(query, (username,))
        user = cursor.fetchone()

        if not user:
            raise ValueError("Usuario o contraseña incorrectos")

        return user
    finally:
        cursor.close()
        conn.close()

def register_dao(username, email, hashed_password, nombre):
    conn = connect_to_database()
    if not conn:
        raise ConnectionError("Error de conexión a la base de datos")
    cursor = conn.cursor()
    try:
        # Verificar si el correo ya existe
        cursor.execute("SELECT id_usuario FROM Usuario WHERE correo = ?", (email,))
        if cursor.fetchone(): 
            raise ValueError("El correo electrónico ya está registrado")

        # Verificar si el username ya existe
        cursor.execute("SELECT id_usuario FROM Usuario WHERE username = ?", (username,))
        if cursor.fetchone(): 
            raise ValueError("El nombre de usuario ya está registrado")
        
        query = """
            INSERT INTO Usuario (nombre, username, correo, contrasena_cifrada, tipo_usuario, id_estatus)
            VALUES (?, ?, ?, ?, 'tutor', 1)
        """
        cursor.execute(query, (nombre, username, email, hashed_password))
        conn.commit()
    finally:
        cursor.close()
        conn.close()