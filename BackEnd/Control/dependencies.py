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
        rol: str = payload.get("rol")
        tipo_usuario: str = payload.get("tipo_usuario")
        nombre: str = payload.get("nombre")
        
        if id_usuario is None or rol is None:
            raise credentials_exception
            
        return {
            "id_usuario": id_usuario,
            "rol": rol,
            "tipo_usuario": tipo_usuario,
            "nombre": nombre
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise credentials_exception

async def require_tutor(current_user: dict = Depends(get_current_user)):
    if current_user.get("rol") != "tutor":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acceso denegado. Se requiere rol de tutor.")
    return current_user

async def require_alumno(current_user: dict = Depends(get_current_user)):
    if current_user.get("rol") != "alumno":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acceso denegado. Se requiere rol de alumno.")
    return current_user