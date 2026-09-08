from pydantic import BaseModel, Field, field_validator
import re

class LoginRequest(BaseModel):
    username: str
    password: str

# Se modifica la respuesta para devolver el token en lugar de los datos expuestos
class LoginResponse(BaseModel):
    message: str
    token: str

class RegisterRequest(BaseModel):
    nombre: str
    apellido: str
    username: str = Field(..., min_length=6, pattern=r'^[a-zA-Z0-9_]+$')
    email: str
    password: str = Field(..., min_length=8)

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$'
        if not re.match(pattern, v):
            raise ValueError('La contraseña debe contener al menos una minúscula, una mayúscula, un número y un carácter especial.')
        return v

class PasswordUpdate(BaseModel):
    contrasena_actual: str
    nueva_contrasena: str

class DeleteAccount(BaseModel):
    contrasena_actual: str