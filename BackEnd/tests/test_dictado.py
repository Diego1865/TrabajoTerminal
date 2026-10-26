import json
import unittest
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

from fastapi import FastAPI
from fastapi.testclient import TestClient
from pydantic import ValidationError

from Control import tutor
from Control.dependencies import get_current_user
from Modelo.dao_tutor import crear_dictado_dao, activar_ejercicio_tutor_dao, get_ejercicios_dao
from Modelo.dao_alumno import registrar_intento_dao
from Modelo.schemas_tutor import DictadoCreate
from Servicios.dictado import POOLS, contenido_dictado, fecha_limite_utc
from Servicios.evaluacion import evaluar


class ContenidoDictadoTests(unittest.TestCase):
    def test_normaliza_sin_perder_acentos_ni_orden(self):
        data = DictadoCreate(titulo="  Mi dictado  ", palabras=[" árbol ", "ÁRBOL", "nin\u0303o", "casa"])
        self.assertEqual(data.titulo, "Mi dictado")
        self.assertEqual(data.palabras, ["árbol", "niño", "casa"])

    def test_rechaza_vacios_frases_signos_y_limites(self):
        for palabras in ([], [""], ["dos palabras"], ["123"], ["hola!"], ["a" * 41], ["casa"] * 51):
            with self.subTest(palabras=palabras), self.assertRaises(ValidationError):
                DictadoCreate(titulo="Dictado", palabras=palabras)
        with self.assertRaises(ValidationError):
            DictadoCreate(titulo=" ", palabras=["casa"])

    def test_pools_validos(self):
        self.assertEqual(len({pool["id"] for pool in POOLS}), len(POOLS))
        for pool in POOLS:
            self.assertEqual(DictadoCreate(titulo=pool["nombre"], palabras=pool["palabras"]).palabras, pool["palabras"])

    def test_evalua_dictado_y_cls_sin_calificar(self):
        contenido = contenido_dictado(["árbol", "niño", "casa"])
        self.assertIsNone(contenido["texto_guia"])
        resultado = evaluar(contenido, {"estado": "procesado", "texto": "arbol\nniño\ncasa"})
        self.assertEqual(resultado["modo"], "dictado")
        self.assertEqual(resultado["observaciones"][0]["tipo"], "acentuacion")
        self.assertTrue(resultado["requiere_revision"])
        self.assertIn("cls", resultado)
        self.assertNotIn("puntuacion", resultado)

    def test_dictado_coincidente_y_omision(self):
        contenido = contenido_dictado(["niño", "casa"])
        self.assertEqual(evaluar(contenido, {"estado": "procesado", "texto": "niño\ncasa"})["observaciones"], [])
        self.assertEqual(evaluar(contenido, {"estado": "procesado", "texto": "niño"})["observaciones"][0]["tipo"], "omision")

    def test_fechas_futuras_con_zona(self):
        futuro = datetime.now(timezone(timedelta(hours=-6))) + timedelta(days=1)
        self.assertEqual(fecha_limite_utc(futuro), futuro.astimezone(timezone.utc).replace(tzinfo=None))
        self.assertIsNone(fecha_limite_utc(None))
        for fecha in (datetime.now(), datetime.now(timezone.utc) - timedelta(days=1)):
            with self.assertRaises(ValueError):
                fecha_limite_utc(fecha)


class PersistenciaDictadoTests(unittest.TestCase):
    @patch("Modelo.dao_tutor.connect_to_database")
    def test_crea_y_asigna_en_una_transaccion_con_tutor_resuelto(self, conectar):
        conn = conectar.return_value
        cursor = conn.cursor.return_value
        cursor.fetchone.side_effect = [(12,), (50,), (60,)]
        resultado = crear_dictado_dao(DictadoCreate(titulo="Dictado", palabras=["niño"]), 99)
        self.assertEqual(resultado["id_ejercicio_tutor"], 60)
        self.assertEqual(cursor.execute.call_args_list[0].args[1], (99,))
        valores = cursor.execute.call_args_list[1].args[1]
        self.assertEqual(valores[3], 12)
        self.assertEqual(json.loads(valores[2])["dictado"]["palabras"], ["niño"])
        self.assertEqual(cursor.execute.call_args_list[2].args[1], (50, 12, None))
        conn.commit.assert_called_once()
        conn.close.assert_called_once()

    @patch("Modelo.dao_tutor.connect_to_database")
    def test_fallo_asignacion_revierte_creacion(self, conectar):
        conn = conectar.return_value
        conn.cursor.return_value.fetchone.side_effect = [(12,), (50,), RuntimeError("fallo")]
        with self.assertRaises(RuntimeError):
            crear_dictado_dao(DictadoCreate(titulo="Dictado", palabras=["niño"]), 99)
        conn.rollback.assert_called_once()
        conn.commit.assert_not_called()

    @patch("Modelo.dao_tutor.connect_to_database")
    def test_no_activa_dictado_ajeno(self, conectar):
        cursor = conectar.return_value.cursor.return_value
        cursor.fetchone.side_effect = [(12,), None]
        with self.assertRaises(ValueError):
            activar_ejercicio_tutor_dao(50, 99, None)
        self.assertIn("id_tutor_creador = ?", cursor.execute.call_args.args[0])
        self.assertEqual(cursor.execute.call_args.args[1], (50, 12))
        conectar.return_value.commit.assert_not_called()

    @patch("Modelo.dao_tutor.connect_to_database")
    def test_catalogo_filtra_por_usuario_autenticado(self, conectar):
        cursor = conectar.return_value.cursor.return_value
        cursor.fetchall.return_value = []
        self.assertEqual(get_ejercicios_dao(99), [])
        self.assertIn("id_tutor_creador IS NULL", cursor.execute.call_args.args[0])
        self.assertEqual(cursor.execute.call_args.args[1], (99,))

    @patch("Modelo.dao_alumno.reconocer_escritura")
    @patch("Modelo.dao_alumno.connect_to_database")
    def test_rechaza_entrega_vencida_antes_del_ocr(self, conectar, reconocer):
        conectar.return_value.cursor.return_value.fetchone.side_effect = [(3,), (2, '{}')]
        with self.assertRaises(ValueError):
            registrar_intento_dao(60, "imagen", 99)
        reconocer.assert_not_called()
        conectar.return_value.commit.assert_not_called()

    @patch("Modelo.dao_alumno.reconocer_escritura")
    @patch("Modelo.dao_alumno.connect_to_database")
    def test_entrega_dictado_conserva_referencia_y_evaluacion(self, conectar, reconocer):
        cursor = conectar.return_value.cursor.return_value
        cursor.fetchone.side_effect = [(3,), (1, json.dumps(contenido_dictado(["niño", "casa"])))]
        reconocer.return_value = {"estado": "procesado", "texto": "niño casa"}
        resultado = registrar_intento_dao(60, "imagen", 99)
        self.assertEqual(resultado["evaluacion_preliminar"]["modo"], "dictado")
        self.assertEqual(resultado["evaluacion_preliminar"]["observaciones"], [])
        conectar.return_value.commit.assert_called_once()


class ApiDictadoTests(unittest.TestCase):
    def setUp(self):
        self.app = FastAPI()
        self.app.include_router(tutor.router, prefix="/api/tutor")
        self.client = TestClient(self.app)

    def tearDown(self):
        self.client.close()

    def usuario(self, tipo="tutor"):
        self.app.dependency_overrides[get_current_user] = lambda: {"id_usuario": 99, "tipo_usuario": tipo}

    def test_requiere_autenticacion_y_rol_tutor(self):
        for ruta in ("/api/tutor/dictados/pools", "/api/tutor/ejercicios"):
            self.assertEqual(self.client.get(ruta).status_code, 401)
        self.assertEqual(self.client.post("/api/tutor/dictados", json={}).status_code, 401)
        self.usuario("alumno")
        self.assertEqual(self.client.get("/api/tutor/dictados/pools").status_code, 403)
        self.assertEqual(self.client.post("/api/tutor/dictados", json={"titulo": "Dictado", "palabras": ["casa"]}).status_code, 403)

    @patch("Control.tutor.crear_dictado_dao")
    def test_creacion_usa_identidad_del_token(self, crear):
        self.usuario()
        crear.return_value = {"id_ejercicio": 50}
        respuesta = self.client.post("/api/tutor/dictados", json={"titulo": "Dictado", "palabras": ["niño"], "id_usuario": 123})
        self.assertEqual(respuesta.status_code, 201)
        self.assertEqual(crear.call_args.args[1], 99)
        self.assertEqual(self.client.get("/api/tutor/dictados/pools").json(), POOLS)

    @patch("Control.tutor.crear_dictado_dao")
    def test_validacion_antes_de_persistir(self, crear):
        self.usuario()
        self.assertEqual(self.client.post("/api/tutor/dictados", json={"titulo": "Dictado", "palabras": []}).status_code, 422)
        crear.assert_not_called()


if __name__ == "__main__":
    unittest.main()
