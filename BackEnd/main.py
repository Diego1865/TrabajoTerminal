from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Importar el enrutador de autenticación
from Control.auth import router as auth_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Permitir solo el origen de frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir las rutas de control
app.include_router(auth_router, prefix="/api/auth", tags=["Autenticacion"])

@app.get('/')
async def read_root():
    return {"message": "API funcionando correctamente"}