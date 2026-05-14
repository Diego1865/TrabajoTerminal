from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Control.auth import router as auth_router
from Control.alumno import router as alumno_router
from Control.ejercicios import router as ejercicios_router
from Control.tareas.cerrar_ejercicio import iniciar_scheduler
from Control.intentos import router as intentos_router
from Control.tutor import router as tutor_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir solo el origen de frontend
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir las rutas de control
app.include_router(tutor_router, prefix="/api/tutor", tags=["Tutor"])
app.include_router(auth_router, prefix="/api/auth", tags=["Autenticacion"])
app.include_router(alumno_router, prefix="/api/alumno", tags=["Alumno"])
app.include_router(ejercicios_router, prefix="/api/ejercicios", tags=["ejercicios"])

@app.get('/')
async def read_root():
    return {"message": "API funcionando correctamente"}

@app.on_event("startup")
async def startup():
    iniciar_scheduler()