echo "Iniciando servidores..."

# Iniciar Backend
cd BackEnd || exit
sudo docker start TT
source ../env/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACK_PID=$!

# Iniciar Frontend
cd ../FrontEnd || exit
npm run dev &
FRONT_PID=$!

# Atrapar la señal de interrupción (Ctrl+C) para cerrar los subprocesos
trap "echo 'Deteniendo servidores...'; kill $BACK_PID $FRONT_PID; sudo docker stop TT; echo 'TT detenido'; exit" INT TERM EXIT

# Esperar a que los procesos terminen
wait