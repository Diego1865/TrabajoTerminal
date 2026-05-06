#!/bin/bash

# Variables
CONTENEDOR="sqlserver_recuperado"
IMAGEN="mcr.microsoft.com/mssql/server:2022-latest"
RUTA_SQL="./BackEnd/BD/esquemaBD.sql"

echo "1. Deteniendo y eliminando el contenedor anterior..."
sudo docker stop $CONTENEDOR 2>/dev/null
sudo docker rm $CONTENEDOR 2>/dev/null

echo "2. Iniciando un nuevo contenedor de SQL Server..."
sudo docker run -e "ACCEPT_EULA=Y" -e 'MSSQL_SA_PASSWORD=%WafTT-1' \
    -p 1433:1433 --name $CONTENEDOR -d $IMAGEN

echo "3. Esperando 15 segundos para la inicialización del motor de base de datos..."
sleep 15

if [ -f "$RUTA_SQL" ]; then
    echo "4. Copiando el archivo de esquema al contenedor..."
    sudo docker cp "$RUTA_SQL" "$CONTENEDOR:/tmp/esquema_BD.sql"

    echo "5. Ejecutando el esquema en SQL Server..."
    # Se utiliza el parámetro -C para aceptar el certificado autofirmado (TrustServerCertificate)
    sudo docker exec $CONTENEDOR /opt/mssql-tools18/bin/sqlcmd \
        -S localhost -U sa -P '%WafTT-1' -C -i /tmp/esquema_BD.sql
    
    echo "Actualización completada."
else
    echo "Error: No se encontró el archivo $RUTA_SQL. Verifique si el nombre es esquemaBD.sql o esquema_BD.sql."
fi