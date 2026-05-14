from fastapi import APIRouter, HTTPException, status
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
import os
from Modelo.schemas_auth import LoginRequest, LoginResponse, RegisterRequest
from Modelo.dao_auth import login_dao, register_dao
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

# Configuración para la verificación de contraseñas y JWT
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 horas


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password[:72])

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login", response_model=LoginResponse)
def login(credentials: LoginRequest):
    
    try:
        user = login_dao(credentials.username)
        id_usuario, contrasena_cifrada, nombre, tipo_usuario, id_estatus, id_tutor, id_alumno = user
        if id_estatus != 1:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="El usuario no se encuentra activo")
        if not verify_password(credentials.password, contrasena_cifrada):
            raise HTTPException( status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario o contraseña incorrectos")
            
        # Generar Token unificado
        token_payload = {
            "id_usuario": id_usuario, 
            "nombre": nombre, 
            "tipo_usuario": tipo_usuario,
            "id_tutor": id_tutor,
            "id_alumno": id_alumno
        }

        token = create_access_token(token_payload)
        return {"message": "Inicio de sesión exitoso", "token": token}
    except ConnectionError as ce:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(ce))
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {str(e)}")

@router.post("/register")
def register(user_data: RegisterRequest):
    hashed_password = get_password_hash(user_data.password)
    try:
        register_dao(user_data.username, user_data.email, hashed_password, user_data.nombre,user_data.apellido)
        return {"message": "Usuario registrado exitosamente"}
    except ConnectionError as ce:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(ce))
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {str(e)}")