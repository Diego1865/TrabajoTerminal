from pydantic import BaseModel

class TutorUpdate(BaseModel):
    nombre: str

class EmailUpdate(BaseModel):
    correo: str
    contrasena_actual: str