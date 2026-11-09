import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import FastAPI
from fastapi.testclient import TestClient

from Control import tutor
from Control.dependencies import get_current_user
from Modelo import dao_tutor

MIGRACION = Path(__file__).resolve().parents[1] / "BD" / "migraciones" / "004_progreso_vista.sql"


def sql_ejecutado(cursor):
    return " ".join(llamada.args[0] for llamada in cursor.execute.call_args_list)


class ProgresoComoVistaTests(unittest.TestCase):
    @patch("Modelo.dao_tutor.connect_to_database")
    def test_calificar_no_escribe_tablas_de_progreso(self, conectar):
        cursor = conectar.return_value.cursor.return_value
        cursor.fetchone.return_value = (5, None, None, None)
        dao_tutor.calificar_intento_dao(1, 80, "bien", legibilidad={
            "alineacion": 8, "tamano": 8, "espaciado": 8, "inclinacion": 8})
        sql = sql_ejecutado(cursor)
        self.assertIn("Analisis_Caligrafico", sql)
        self.assertNotIn("Progreso_Alumno", sql)
        self.assertNotIn("Historial_Alumno", sql)
        conectar.return_value.commit.assert_called_once()

    @patch("Modelo.dao_tutor.connect_to_database")
    def test_categorias_leen_la_vista_solo_alumnos_activos(self, conectar):
        cursor = conectar.return_value.cursor.return_value
        cursor.fetchall.return_value = [(1, "Ana", "Paz", None, 9.0, 8.0, 8.5)]
        self.assertEqual(dao_tutor.obtener_alumnos_excelencia_dao(3), [{
            "id_alumno": 1, "nombre": "Ana", "apellido_paterno": "Paz", "apellido_materno": None,
            "promedio_ortografia": 9.0, "promedio_legibilidad": 8.0, "promedio_general": 8.5}])
        sql = sql_ejecutado(cursor)
        self.assertIn("vw_Progreso_Alumno", sql)
        self.assertIn("p.id_estatus = 1", sql)
        self.assertIn("p.promedio_general > 8.0", sql)
        self.assertEqual(cursor.execute.call_args.args[1], (3,))

    def test_migracion_crea_vista_e_indices_y_quita_tablas(self):
        sql = MIGRACION.read_text(encoding="utf-8")
        for fragmento in ("CREATE OR ALTER VIEW dbo.vw_Progreso_Alumno", "IX_Intentos_alumno",
                          "DROP TABLE dbo.Historial_Alumno", "DROP TABLE dbo.Progreso_Alumno"):
            self.assertIn(fragmento, sql)


class IntentosPorAlumnoTests(unittest.TestCase):
    @patch("Modelo.dao_tutor.connect_to_database")
    def test_lista_sin_imagen_y_filtrada_por_tutor_y_alumno(self, conectar):
        cursor = conectar.return_value.cursor.return_value
        cursor.fetchone.return_value = (1,)
        cursor.fetchall.return_value = []
        self.assertEqual(dao_tutor.obtener_intentos_alumno_dao(7, 3), [])
        consulta = cursor.execute.call_args_list[-1]
        self.assertIn("NULL AS imagen_codificada", consulta.args[0])
        self.assertIn("a.id_alumno = ?", consulta.args[0])
        self.assertEqual(consulta.args[1], (3, 7))

    @patch("Modelo.dao_tutor.connect_to_database")
    def test_alumno_de_otro_tutor(self, conectar):
        conectar.return_value.cursor.return_value.fetchone.return_value = None
        with self.assertRaises(PermissionError):
            dao_tutor.obtener_intentos_alumno_dao(7, 3)
        with self.assertRaises(PermissionError):
            dao_tutor.obtener_imagen_intento_dao(10, 3)

    @patch("Modelo.dao_tutor.connect_to_database")
    def test_ruta_anterior_conserva_imagen(self, conectar):
        cursor = conectar.return_value.cursor.return_value
        cursor.fetchall.return_value = []
        dao_tutor.obtener_intentos_por_tutor_dao(3)
        self.assertIn("i.imagen_codificada AS imagen_codificada", cursor.execute.call_args.args[0])


class ApiRevisionTests(unittest.TestCase):
    def setUp(self):
        self.app = FastAPI()
        self.app.include_router(tutor.router, prefix="/api/tutor")
        self.app.dependency_overrides[get_current_user] = lambda: {"id_usuario": 99, "tipo_usuario": "tutor"}
        self.client = TestClient(self.app)

    def tearDown(self):
        self.client.close()

    @patch("Control.tutor.obtener_intentos_alumno_dao")
    def test_intentos_del_alumno(self, obtener):
        obtener.return_value = []
        self.assertEqual(self.client.get("/api/tutor/alumnos/7/intentos").json(), [])
        obtener.assert_called_once_with(7, 99)
        obtener.side_effect = PermissionError("no")
        self.assertEqual(self.client.get("/api/tutor/alumnos/7/intentos").status_code, 403)

    @patch("Control.tutor.obtener_imagen_intento_dao")
    def test_imagen_de_un_intento(self, obtener):
        obtener.return_value = "aW1n"
        self.assertEqual(self.client.get("/api/tutor/intentos/10/imagen").json(), {"imagen_codificada": "aW1n"})
        obtener.assert_called_once_with(10, 99)
        obtener.side_effect = PermissionError("no")
        self.assertEqual(self.client.get("/api/tutor/intentos/10/imagen").status_code, 403)

    def test_requiere_rol_tutor(self):
        self.app.dependency_overrides[get_current_user] = lambda: {"id_usuario": 99, "tipo_usuario": "alumno"}
        self.assertEqual(self.client.get("/api/tutor/alumnos/7/intentos").status_code, 403)
        self.assertEqual(self.client.get("/api/tutor/intentos/10/imagen").status_code, 403)


if __name__ == "__main__":
    unittest.main()
