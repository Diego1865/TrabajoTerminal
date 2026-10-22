from fastapi import APIRouter, HTTPException, status
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
import os
from Modelo.schemas_auth import (LoginRequest, LoginResponse, RegisterRequest, CodigoRegistroRequest,
                                 RecuperarCodigoRequest, RestablecerPasswordRequest)
from Modelo.dao_auth import login_dao, register_dao, verificar_disponibles_dao, obtener_tutor_por_correo_dao
from Modelo.dao_tutor import actualizar_password_tutor_dao
from Servicios.codigos import CodigoError, crear_codigo, verificar_codigo, permitir_envio, liberar_envio
from Servicios.correo import CorreoError, enviar_correo
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
    except HTTPException:
        raise
    except ConnectionError as ce:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(ce))
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {str(e)}")

def enviar_codigo(destino, proposito, asunto, motivo, extra="", enviar=True):
    """Genera el código, lo manda por correo y devuelve el token que lo acompaña."""
    permitir_envio(destino)
    codigo, token = crear_codigo(proposito, destino, extra)
    if enviar:
        try:
            enviar_correo(destino, asunto,
                f"Hola:\n\nTu código de Graf-IA para {motivo} es: {codigo}\n\n"
                "Vence en 10 minutos. Si no lo pediste, ignora este correo.")
        except CorreoError:
            liberar_envio(destino)
            raise
    return token

#Verificación de correo al registrarse
@router.post("/registro/codigo")
def solicitar_codigo_registro(datos: CodigoRegistroRequest):
    try:
        verificar_disponibles_dao(datos.username, datos.email)
        token = enviar_codigo(datos.email, "registro", "Código para crear tu cuenta", "crear tu cuenta")
        return {"message": "Te enviamos un código a tu correo.", "token_verificacion": token}
    except CorreoError as ce:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(ce))
    except ConnectionError as ce:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(ce))
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))

@router.post("/register")
def register(user_data: RegisterRequest):
    hashed_password = get_password_hash(user_data.password)
    try:
        verificar_codigo(user_data.token_verificacion, "registro", user_data.email, user_data.codigo)
        register_dao(user_data.username, user_data.email, hashed_password, user_data.nombre,user_data.apellido)
        return {"message": "Usuario registrado exitosamente"}
    except ConnectionError as ce:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(ce))
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {str(e)}")

#Recuperar contraseña (solo tutores; a los alumnos se la restablece su tutor)
MENSAJE_RECUPERAR = "Si el correo pertenece a una cuenta activa, te enviamos un código."

@router.post("/recuperar/codigo")
def solicitar_codigo_recuperacion(datos: RecuperarCodigoRequest):
    try:
        tutor = obtener_tutor_por_correo_dao(datos.correo)
        # Se responde igual exista o no la cuenta, para no revelar qué correos están registrados.
        # La huella incluye la contraseña actual: al cambiarla, el código deja de servir.
        token = enviar_codigo(datos.correo, "recuperar", "Código para recuperar tu contraseña",
                              "recuperar tu contraseña", extra=tutor[1] if tutor else "", enviar=tutor is not None)
        return {"message": MENSAJE_RECUPERAR, "token_verificacion": token}
    except CorreoError as ce:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(ce))
    except ConnectionError as ce:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(ce))
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))

@router.post("/recuperar/cambiar")
def restablecer_password(datos: RestablecerPasswordRequest):
    try:
        tutor = obtener_tutor_por_correo_dao(datos.correo)
        verificar_codigo(datos.token_verificacion, "recuperar", datos.correo, datos.codigo, tutor[1] if tutor else "")
        if not tutor:
            raise CodigoError("Código no válido. Pide uno nuevo.")
        actualizar_password_tutor_dao(get_password_hash(datos.nueva_contrasena), tutor[0])
        return {"message": "Contraseña actualizada. Ya puedes iniciar sesión."}
    except ConnectionError as ce:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(ce))
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
