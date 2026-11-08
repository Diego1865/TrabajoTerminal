import unittest
from datetime import datetime
from unittest.mock import patch

from fastapi import FastAPI
from fastapi.testclient import TestClient
from pydantic import ValidationError

from Control import alumno, tutor
from Control.dependencies import get_current_user
from Modelo.dao_alumno import obtener_perfil_alumno_dao
from Modelo.dao_tutor import obtener_perfil_tutor_dao, actualizar_nombre_tutor_dao
from Modelo.schemas_tutor import TutorUpdate

REGISTRO = datetime(2026, 9, 1, 10, 30)


class TutorUpdateTests(unittest.TestCase):
    def test_recorta_espacios_y_apellido_vacio_queda_nulo(self):
        datos = TutorUpdate(nombre="  Ana   María ", apellido_paterno="   ")
        self.assertEqual(datos.nombre, "Ana María")
        self.assertIsNone(datos.apellido_paterno)

    def test_apellido_es_opcional(self):
        self.assertIsNone(TutorUpdate(nombre="Ana").apellido_paterno)

    def test_rechaza_nombre_vacio_o_largo(self):
        for invalido in ({"nombre": "   "}, {"nombre": "a" * 51}, {"nombre": "Ana", "apellido_paterno": "b" * 51}):
            with self.assertRaises(ValidationError):
                TutorUpdate(**invalido)


class PerfilDaoTests(unittest.TestCase):
    @patch("Modelo.dao_alumno.connect_to_database")
    def test_perfil_alumno_incluye_tutor(self, conectar):
        cursor = conectar.return_value.cursor.return_value
        cursor.fetchone.return_value = ("Luis", "Pérez", None, "luis.p", "3°", "A", REGISTRO, "Ana", "López")
        perfil = obtener_perfil_alumno_dao(7)
        self.assertEqual(perfil["usuario"], "luis.p")
        self.assertEqual(perfil["tutor"], "Ana López")
        self.assertIsNone(perfil["apellido_materno"])
        self.assertEqual(cursor.execute.call_args.args[1], (7,))
        conectar.return_value.close.assert_called_once()

    @patch("Modelo.dao_alumno.connect_to_database")
    def test_perfil_alumno_sin_tutor_ni_fila(self, conectar):
        cursor = conectar.return_value.cursor.return_value
        cursor.fetchone.return_value = ("Luis", "Pérez", None, "luis.p", "3°", None, REGISTRO, None, None)
        self.assertIsNone(obtener_perfil_alumno_dao(7)["tutor"])
        cursor.fetchone.return_value = None
        self.assertIsNone(obtener_perfil_alumno_dao(7))

    @patch("Modelo.dao_tutor.connect_to_database")
    def test_perfil_tutor(self, conectar):
        cursor = conectar.return_value.cursor.return_value
        cursor.fetchone.return_value = ("Ana", "López", "ana", "ana@correo.com", REGISTRO)
        self.assertEqual(obtener_perfil_tutor_dao(3), {
            "nombre": "Ana", "apellido_paterno": "López", "usuario": "ana",
            "correo": "ana@correo.com", "fecha_registro": REGISTRO,
        })

    @patch("Modelo.dao_tutor.connect_to_database")
    def test_actualiza_nombre_y_apellido(self, conectar):
        cursor = conectar.return_value.cursor.return_value
        actualizar_nombre_tutor_dao("Ana", "López", 3)
        self.assertEqual(cursor.execute.call_args.args[1], ("Ana", "López", 3))
        conectar.return_value.commit.assert_called_once()


class ApiPerfilTests(unittest.TestCase):
    def setUp(self):
        self.app = FastAPI()
        self.app.include_router(tutor.router, prefix="/api/tutor")
        self.app.include_router(alumno.router, prefix="/api/alumno")
        self.client = TestClient(self.app)

    def tearDown(self):
        self.client.close()

    def usuario(self, tipo):
        self.app.dependency_overrides[get_current_user] = lambda: {"id_usuario": 99, "tipo_usuario": tipo}

    def test_cada_rol_solo_ve_su_perfil(self):
        self.assertEqual(self.client.get("/api/alumno/perfil").status_code, 401)
        self.usuario("tutor")
        self.assertEqual(self.client.get("/api/alumno/perfil").status_code, 403)
        self.usuario("alumno")
        self.assertEqual(self.client.get("/api/tutor/perfil").status_code, 403)

    @patch("Control.alumno.obtener_perfil_alumno_dao")
    def test_perfil_alumno_usa_identidad_del_token(self, obtener):
        self.usuario("alumno")
        obtener.return_value = {"nombre": "Luis", "fecha_registro": REGISTRO}
        respuesta = self.client.get("/api/alumno/perfil")
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.json()["fecha_registro"], "2026-09-01T10:30:00")
        obtener.assert_called_once_with(99)
        obtener.return_value = None
        self.assertEqual(self.client.get("/api/alumno/perfil").status_code, 404)

    @patch("Control.tutor.actualizar_nombre_tutor_dao")
    @patch("Control.tutor.obtener_perfil_tutor_dao")
    def test_perfil_tutor_y_cambio_de_nombre(self, obtener, actualizar):
        self.usuario("tutor")
        obtener.return_value = {"nombre": "Ana"}
        self.assertEqual(self.client.get("/api/tutor/perfil").json(), {"nombre": "Ana"})
        respuesta = self.client.put("/api/tutor/act/nombre", json={"nombre": " Ana ", "apellido_paterno": "López"})
        self.assertEqual(respuesta.status_code, 200)
        actualizar.assert_called_once_with("Ana", "López", 99)
        self.assertEqual(self.client.put("/api/tutor/act/nombre", json={"nombre": ""}).status_code, 422)


if __name__ == "__main__":
    unittest.main()
