from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field, field_validator
import re
from Modelo.database import connect_to_database
from passlib.context import CryptContext

router = APIRouter()

# Configuración para la verificación de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Modelos de Pydantic para la validación de datos
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    message: str
    id_usuario: int
    nombre: str
    rol: str
    tipo_usuario: str

class RegisterRequest(BaseModel):
    nombre: str
    username: str = Field(..., min_length=6, pattern=r'^[a-zA-Z0-9_]+$')
    email: str
    password: str = Field(..., min_length=8)
    rol: str = "tutor"

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$'
        if not re.match(pattern, v):
            raise ValueError('La contraseña debe contener al menos una minúscula, una mayúscula, un número y un carácter especial.')
        return v

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
        # Primero, consulta a la tabla Usuario (Tutores/Administradores)
        query_tutor = """
            SELECT id_usuario, contrasena_cifrada, nombre, rol, id_estatus 
            FROM Usuario
            WHERE username = ?
        """
        cursor.execute(query_tutor, credentials.username)
        user = cursor.fetchone()

        if user:
            # Usuario es tutor/administrador
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
                    detail="Usuario o contraseña incorrectos"
                )

            return {
                "message": "Inicio de sesión exitoso",
                "id_usuario": id_usuario,
                "nombre": nombre,
                "rol": rol,
                "tipo_usuario": "tutor"
            }
        
        # Si no es tutor, buscar en la tabla Alumno
        query_alumno = """
            SELECT id_alumno, contrasena_cifrada, nombre, id_estatus 
            FROM Alumno
            WHERE usuario = ?
        """
        cursor.execute(query_alumno, credentials.username)
        alumno = cursor.fetchone()

        if not alumno:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario o contraseña incorrectos"
            )

        id_alumno, contrasena_cifrada_alumno, nombre_alumno, id_estatus_alumno = alumno

        # Verificar estatus activo
        if id_estatus_alumno != 1:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="El alumno no se encuentra activo"
            )

        # Verificar la contraseña del alumno
        if not verify_password(credentials.password, contrasena_cifrada_alumno):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario o contraseña incorrectos"
            )

        return {
            "message": "Inicio de sesión exitoso",
            "id_usuario": id_alumno,
            "nombre": nombre_alumno,
            "rol": "alumno",
            "tipo_usuario": "alumno"
        }

    except HTTPException:
        raise
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
        cursor.execute("SELECT id_usuario FROM Usuario WHERE correo = ?", user_data.email)
        if cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El correo electrónico ya está registrado"
            )

        # Verificar si el username ya existe
        cursor.execute("SELECT id_usuario FROM Usuario WHERE username = ?", user_data.username)
        if cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El nombre de usuario ya está registrado"
            )

        hashed_password = get_password_hash(user_data.password)
        
        query = """
            INSERT INTO Usuario (nombre, username, correo, contrasena_cifrada, rol, id_estatus)
            VALUES (?, ?, ?, ?, ?, 1)
        """
        cursor.execute(query, (user_data.nombre, user_data.username, user_data.email, hashed_password, user_data.rol))
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