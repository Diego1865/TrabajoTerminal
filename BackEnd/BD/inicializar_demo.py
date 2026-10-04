"""Inicializa la demo sin borrar datos; aborta si falla un lote SQL."""
import os
from pathlib import Path
import re
import pyodbc


def ejecutar_archivo(conexion, archivo):
    sql = archivo.read_text(encoding="utf-8-sig")
    for lote in re.split(r"^\s*GO\s*$", sql, flags=re.MULTILINE | re.IGNORECASE):
        if lote.strip():
            cursor = conexion.cursor()
            try:
                cursor.execute(lote)
                while cursor.nextset():
                    pass
            finally:
                cursor.close()


def main():
    carpeta = Path(__file__).resolve().parent
    # Conectar a master porque TT todavía puede no existir.
    conexion = pyodbc.connect(
        f"DRIVER={os.environ['DB_DRIVER']};SERVER={os.environ['DB_SERVER']};"
        f"DATABASE=master;UID={os.environ['DB_USER']};PWD={os.environ['DB_PASSWORD']};"
        "TrustServerCertificate=yes", autocommit=True,
    )
    try:
        ejecutar_archivo(conexion, carpeta / "esquemaBD.sql")
        conexion.execute("USE TT")
        conexion.execute("""IF OBJECT_ID('dbo.SchemaMigrations', 'U') IS NULL
            CREATE TABLE dbo.SchemaMigrations (nombre NVARCHAR(255) NOT NULL PRIMARY KEY,
                aplicada DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME())""")
        if os.getenv("SEED_DEMO", "false").lower() == "true":
            if conexion.execute("SELECT COUNT(*) FROM dbo.Ejercicios").fetchone()[0] == 0:
                ejecutar_archivo(conexion, carpeta / "ejerciciosEjemplo.sql")
                print("Ejercicios de ejemplo cargados; no se crearon usuarios.")
        for archivo in sorted((carpeta / "migraciones").glob("*.sql")):
            if conexion.execute("SELECT 1 FROM dbo.SchemaMigrations WHERE nombre=?", archivo.name).fetchone():
                continue
            ejecutar_archivo(conexion, archivo)
            conexion.execute("INSERT INTO dbo.SchemaMigrations(nombre) VALUES (?)", archivo.name)
            print(f"Migración aplicada: {archivo.name}")
    finally:
        conexion.close()


if __name__ == "__main__":
    main()
