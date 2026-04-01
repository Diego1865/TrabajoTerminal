from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Control.auth import router as auth_router
from Control.alumnos import router as alumnos_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir solo el origen de frontend
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir las rutas de control
app.include_router(auth_router, prefix="/api/auth", tags=["Autenticacion"])
app.include_router(alumnos_router, prefix="/api/alumnos", tags=["alumnos"])

@app.get('/')
async def read_root():
    return {"message": "API funcionando correctamente"}