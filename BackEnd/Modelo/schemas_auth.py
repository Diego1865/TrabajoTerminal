from pydantic import BaseModel, Field, field_validator
import re

PATRON_CORREO = r'^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$'
PATRON_CONTRASENA = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$'


def validar_correo(v: str) -> str:
    v = (v or "").strip().lower()
    if len(v) > 100 or not re.match(PATRON_CORREO, v):
        raise ValueError('El correo electrónico no es válido.')
    return v


def validar_contrasena(v: str) -> str:
    if len(v) < 8 or not re.match(PATRON_CONTRASENA, v):
        raise ValueError('La contraseña debe tener al menos 8 caracteres, una minúscula, una mayúscula, un número y un carácter especial.')
    return v


class LoginRequest(BaseModel):
    username: str
    password: str

# Se modifica la respuesta para devolver el token en lugar de los datos expuestos
class LoginResponse(BaseModel):
    message: str
    token: str

class CodigoRegistroRequest(BaseModel):
    username: str = Field(..., min_length=6, pattern=r'^[a-zA-Z0-9_]+$')
    email: str

    @field_validator('email')
    @classmethod
    def revisar_correo(cls, v: str) -> str:
        return validar_correo(v)

class RegisterRequest(BaseModel):
    nombre: str
    apellido: str
    username: str = Field(..., min_length=6, pattern=r'^[a-zA-Z0-9_]+$')
    email: str
    password: str = Field(..., min_length=8)
    # Código de 6 dígitos enviado al correo y el token que lo acompaña.
    codigo: str
    token_verificacion: str

    @field_validator('email')
    @classmethod
    def revisar_correo(cls, v: str) -> str:
        return validar_correo(v)
    @field_validator('password')
    @classmethod
    def revisar_contrasena(cls, v: str) -> str:
        return validar_contrasena(v)

class RecuperarCodigoRequest(BaseModel):
    correo: str

    @field_validator('correo')
    @classmethod
    def revisar_correo(cls, v: str) -> str:
        return validar_correo(v)

class RestablecerPasswordRequest(BaseModel):
    correo: str
    codigo: str
    token_verificacion: str
    nueva_contrasena: str

    @field_validator('correo')
    @classmethod
    def revisar_correo(cls, v: str) -> str:
        return validar_correo(v)
    @field_validator('nueva_contrasena')
    @classmethod
    def revisar_contrasena(cls, v: str) -> str:
        return validar_contrasena(v)

class PasswordUpdate(BaseModel):
    contrasena_actual: str
    nueva_contrasena: str

class DeleteAccount(BaseModel):
    contrasena_actual: str
