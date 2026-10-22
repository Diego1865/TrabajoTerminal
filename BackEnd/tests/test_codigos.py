import os
import unittest

os.environ.setdefault("SECRET_KEY", "clave-de-prueba")
from Servicios import codigos
from Servicios.codigos import CodigoError, crear_codigo, verificar_codigo, permitir_envio, liberar_envio


class CodigosTests(unittest.TestCase):
    def setUp(self):
        codigos._intentos.clear(); codigos._usados.clear(); codigos._ultimo_envio.clear()

    def test_codigo_correcto_sirve_una_vez(self):
        codigo, token = crear_codigo("registro", "a@b.com")
        self.assertRegex(codigo, r"^\d{6}$")
        self.assertNotIn(codigo, token)
        verificar_codigo(token, "registro", "a@b.com", codigo)
        with self.assertRaisesRegex(CodigoError, "ya se usó"):
            verificar_codigo(token, "registro", "a@b.com", codigo)

    def test_maximo_cinco_intentos(self):
        codigo, token = crear_codigo("registro", "a@b.com")
        malo = "000000" if codigo != "000000" else "111111"
        for quedan in (4, 3, 2, 1):
            with self.assertRaisesRegex(CodigoError, f"quedan {quedan}"):
                verificar_codigo(token, "registro", "a@b.com", malo)
        with self.assertRaisesRegex(CodigoError, "no quedan"):
            verificar_codigo(token, "registro", "a@b.com", malo)
        with self.assertRaisesRegex(CodigoError, "Demasiados"):
            verificar_codigo(token, "registro", "a@b.com", codigo)

    def test_no_sirve_para_otro_correo_ni_otro_proposito(self):
        codigo, token = crear_codigo("registro", "a@b.com")
        with self.assertRaises(CodigoError):
            verificar_codigo(token, "registro", "otro@b.com", codigo)
        with self.assertRaises(CodigoError):
            verificar_codigo(token, "recuperar", "a@b.com", codigo)

    def test_extra_distinto_invalida(self):
        # En recuperación, extra es el hash de la contraseña: al cambiarla el código deja de servir.
        codigo, token = crear_codigo("recuperar", "a@b.com", "hash-viejo")
        with self.assertRaises(CodigoError):
            verificar_codigo(token, "recuperar", "a@b.com", codigo, "hash-nuevo")

    def test_token_alterado_o_vencido(self):
        codigo, token = crear_codigo("registro", "a@b.com")
        with self.assertRaisesRegex(CodigoError, "no válido"):
            verificar_codigo(token[:-2] + "xx", "registro", "a@b.com", codigo)
        vigencia = codigos.VIGENCIA_SEGUNDOS
        codigos.VIGENCIA_SEGUNDOS = -1
        try:
            codigo, token = crear_codigo("registro", "a@b.com")
        finally:
            codigos.VIGENCIA_SEGUNDOS = vigencia
        with self.assertRaisesRegex(CodigoError, "expiró"):
            verificar_codigo(token, "registro", "a@b.com", codigo)

    def test_un_envio_por_minuto(self):
        permitir_envio("a@b.com")
        with self.assertRaisesRegex(CodigoError, "Espera un minuto"):
            permitir_envio("a@b.com")
        permitir_envio("otro@b.com")
        liberar_envio("a@b.com")
        permitir_envio("a@b.com")


if __name__ == "__main__":
    unittest.main()
