from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from Modelo.database import connect_to_database
from passlib.context import CryptContext

router = APIRouter()

# Configuración para la verificación de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Modelos de Pydantic para la validación de datos
class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    message: str
    id_usuario: int
    nombre: str
    rol: str

class RegisterRequest(BaseModel):
    nombre: str
    email: str
    password: str
    rol: str = "tutor"

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password[:72])

@router.post("/login", response_model=LoginResponse)
async def login(credentials: LoginRequest):
    conn = connect_to_database()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Error de conexión a la base de datos"
        )

    cursor = conn.cursor()
    try:
        # Consulta a la tabla Usuarios (Tutores/Administradores)
        query = """
            SELECT id_usuario, contrasena_cifrada, nombre, rol, id_estatus 
            FROM Usuarios 
            WHERE correo = ?
        """
        cursor.execute(query, credentials.email)
        user = cursor.fetchone()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Correo o contraseña incorrectos"
            )

        id_usuario, contrasena_cifrada, nombre, rol, id_estatus = user

        # Verificar estatus activo (id_estatus = 1 según catálogo)
        if id_estatus != 1:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="El usuario no se encuentra activo"
            )

        # Verificar la contraseña
        if not verify_password(credentials.password, contrasena_cifrada):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Correo o contraseña incorrectos"
            )

        return {
            "message": "Inicio de sesión exitoso",
            "id_usuario": id_usuario,
            "nombre": nombre,
            "rol": rol
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Error: {str(e)}"
        )
    finally:
        cursor.close()
        conn.close()

@router.post("/register")
async def register(user_data: RegisterRequest):
    conn = connect_to_database()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Error de conexión a la base de datos"
        )

    cursor = conn.cursor()
    try:
        # Verificar si el correo ya existe
        cursor.execute("SELECT id_usuario FROM Usuarios WHERE correo = ?", user_data.email)
        if cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El correo electrónico ya está registrado"
            )

        hashed_password = get_password_hash(user_data.password)
        
        query = """
            INSERT INTO Usuarios (nombre, correo, contrasena_cifrada, rol, id_estatus)
            VALUES (?, ?, ?, ?, 1)
        """
        cursor.execute(query, (user_data.nombre, user_data.email, hashed_password, user_data.rol))
        conn.commit()

        return {"message": "Usuario registrado exitosamente"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Error al registrar usuario: {str(e)}"
        )
    finally:
        cursor.close()
        conn.close()