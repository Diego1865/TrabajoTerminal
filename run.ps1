Write-Host "Iniciando servidores en nuevas ventanas..."

# Iniciar Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "echo 'Iniciando Backend...'; docker start TT; cd BackEnd; ..\env\Scripts\Activate.ps1; uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

# Iniciar Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "echo 'Iniciando Frontend...'; cd FrontEnd; npm run dev"