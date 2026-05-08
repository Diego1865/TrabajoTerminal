#!/bin/bash

# Función para limpiar procesos al salir
cleanup() {
    echo -e "\n[!] Deteniendo servidores..."
    # Matar los PIDs si existen
    [[ -n $BACK_PID ]] && kill $BACK_PID 2>/dev/null
    [[ -n $FRONT_PID ]] && kill $FRONT_PID 2>/dev/null
    
    echo "[*] Deteniendo contenedor Docker..."
    sudo docker stop TT 2>/dev/null
    echo "[✓] Todo detenido correctamente."
    exit
}

# Capturar Ctrl+C y otras señales de salida
trap cleanup INT TERM EXIT

echo "[+] Iniciando entorno del Proyecto..."

# 1. Iniciar Docker (Base de Datos)
echo "[*] Iniciando SQL Server en Docker..."
sudo docker start TT

# 2. Iniciar Backend
echo "[*] Iniciando Backend (FastAPI)..."
if [ -d "BackEnd" ]; then
    cd BackEnd || exit
    source ../env/bin/activate
    # Usamos python -m uvicorn para asegurar que use el del venv
    python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
    BACK_PID=$!
    cd ..
else
    echo "Error: No se encontró la carpeta BackEnd"
    exit 1
fi

# 3. Iniciar Frontend
echo "[*] Iniciando Frontend (Next.js)..."
if [ -d "FrontEnd" ]; then
    cd FrontEnd || exit
    # Usamos npx para asegurar que encuentre el comando 'next' local
    npx next dev &
    FRONT_PID=$!
    cd ..
else
    echo "Error: No se encontró la carpeta FrontEnd"
    exit 1
fi

echo "[✓] Servidores corriendo. Presiona Ctrl+C para detener."

# Esperar a que los procesos terminen
wait
