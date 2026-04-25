from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id_usuario: int = payload.get("id_usuario")
        tipo_usuario: str = payload.get("tipo_usuario")
        nombre: str = payload.get("nombre")
        
        if id_usuario is None or tipo_usuario is None:
            raise credentials_exception
            
        return {
            "id_usuario": id_usuario,
            "tipo_usuario": tipo_usuario,
            "nombre": nombre
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise credentials_exception

async def require_tutor(current_user: dict = Depends(get_current_user)):
    if current_user.get("tipo_usuario") != "tutor":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acceso denegado. Se requiere ser tutor.")
    return current_user

async def require_alumno(current_user: dict = Depends(get_current_user)):
    if current_user.get("tipo_usuario") != "alumno":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acceso denegado. Se requiere ser alumno.")
    return current_user