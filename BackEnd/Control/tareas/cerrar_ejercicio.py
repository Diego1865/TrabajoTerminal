from apscheduler.schedulers.asyncio import AsyncIOScheduler
from Modelo.database import connect_to_database

scheduler = AsyncIOScheduler()

def cerrar_ejercicios_vencidos():
    conn = connect_to_database()
    if not conn:
        print("Cron: Error de conexión")
        return
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE Ejercicios_Tutor
            SET id_estatus = 2
            WHERE id_estatus = 1
              AND fecha_desactivacion IS NOT NULL
              AND fecha_desactivacion < GETDATE()
        """)
        conn.commit()
        print(f"Cron: {cursor.rowcount} ejercicios cerrados")
    except Exception as e:
        print("Cron error:", e)
    finally:
        cursor.close()
        conn.close()

def iniciar_scheduler():
    scheduler.add_job(cerrar_ejercicios_vencidos, 'interval', hours=1)
    scheduler.start()