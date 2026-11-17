"""Fichas PDF propias; toda la generación ocurre en memoria, sin servicios externos."""
from io import BytesIO
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Flowable, Paragraph, SimpleDocTemplate, Spacer

TINTA = colors.HexColor("#24334D")
ACENTO = colors.HexColor("#5B21B6")
GUIA = colors.HexColor("#9CA3AF")
ANCHO = letter[0] - 84


class DibujoMotricidad(Flowable):
    def __init__(self, ficha):
        super().__init__()
        self.ficha = ficha
        self.width = ANCHO
        self.height = 268 if ficha["tipo"] == "laberinto" else 225

    def draw(self):
        c = self.canv
        c.setStrokeColor(TINTA)
        c.setFillColor(TINTA)
        c.setLineWidth(1.5)
        tipo = self.ficha["tipo"]
        if tipo == "laberinto":
            columnas, filas = self.ficha["columnas"], self.ficha["filas"]
            unidad = min((self.width - 100) / columnas, (self.height - 26) / filas)
            x0 = (self.width - columnas * unidad) / 2
            y0 = self.height - 8
            for x1, y1, x2, y2 in self.ficha["paredes"]:
                c.line(x0 + x1 * unidad, y0 - y1 * unidad, x0 + x2 * unidad, y0 - y2 * unidad)
            c.setFont("Helvetica-Bold", 10)
            c.drawRightString(x0 - 6, y0 - unidad / 2 - 3, "Entrada")
            c.drawString(x0 + columnas * unidad + 6, y0 - (filas - .5) * unidad - 3, "Salida")
        elif tipo == "bolitas":
            c.setFont("Helvetica", 10)
            for i in range(10):
                columna = i % 5 if i < 5 else 4 - i % 5
                x = 58 + columna * 103
                y = 165 if i < 5 else 65
                c.circle(x, y, 26, stroke=1, fill=0)
                c.drawCentredString(x, y - 4, str(i + 1))
            c.setFont("Helvetica", 10)
            c.drawCentredString(self.width / 2, 12, "Coloca una bolita sobre cada círculo.")
        else:
            c.setStrokeColor(GUIA)
            c.rect(14, 20, self.width - 28, 190, stroke=1, fill=0)
            c.setStrokeColor(TINTA)
            c.setDash(6, 5)
            for i in range(1, 6):
                x = 14 + i * (self.width - 28) / 6
                c.line(x, 20, x, 210)
            c.setDash()
            c.setFont("Helvetica", 10)
            c.drawCentredString(self.width / 2, 3, "Modelo: rasga con las manos siguiendo las cinco líneas.")


class RenglonPalabra(Flowable):
    """Un modelo y tres espacios amplios; cada palabra puede pasar a otra página."""
    def __init__(self, palabra):
        super().__init__()
        self.width = ANCHO
        self.modelo = Paragraph(escape(palabra), ParagraphStyle(
            "modelo", fontName="Helvetica-Bold", fontSize=15, leading=19, textColor=TINTA))
        _, self.alto_modelo = self.modelo.wrap(self.width, 1000)
        self.height = self.alto_modelo + 41

    def draw(self):
        self.modelo.drawOn(self.canv, 0, self.height - self.alto_modelo)
        self.canv.setStrokeColor(GUIA)
        self.canv.setLineWidth(.7)
        for i in range(3):
            x = i * self.width / 3
            self.canv.line(x, 11, x + self.width / 3 - 16, 11)
            self.canv.setDash(2, 3)
            self.canv.line(x, 25, x + self.width / 3 - 16, 25)
            self.canv.setDash()


def _pie(canvas, documento):
    canvas.saveState()
    canvas.setStrokeColor(GUIA)
    canvas.setLineWidth(.5)
    canvas.line(42, 40, letter[0] - 42, 40)
    canvas.setFillColor(TINTA)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(42, 27, "Graf-IA | Práctica opcional, sin entrega ni calificación")
    canvas.drawRightString(letter[0] - 42, 27, f"Página {documento.page}")
    canvas.restoreState()


def generar_ficha_pdf(recomendacion):
    salida = BytesIO()
    documento = SimpleDocTemplate(salida, pagesize=letter, rightMargin=42, leftMargin=42,
                                 topMargin=36, bottomMargin=52, title=recomendacion["titulo"], author="Graf-IA")
    cuerpo = ParagraphStyle("cuerpo", fontName="Helvetica", fontSize=10, leading=14,
                            textColor=TINTA, spaceAfter=6)
    titulo = ParagraphStyle("titulo", parent=cuerpo, fontName="Helvetica-Bold", fontSize=22,
                            leading=26, textColor=ACENTO, spaceAfter=10)
    etiqueta = ParagraphStyle("etiqueta", parent=cuerpo, fontName="Helvetica-Bold", fontSize=9,
                              textColor=ACENTO, spaceAfter=7)
    bloques = [
        Paragraph("GRAF-IA / MI FICHA DE PRÁCTICA", etiqueta),
        Paragraph(escape(recomendacion["titulo"]), titulo),
        Paragraph("Nombre: __________________________________   Fecha: ______________", cuerpo),
        Paragraph(escape(recomendacion["objetivo"]), cuerpo),
        Paragraph("<b>Materiales:</b> " + escape(", ".join(recomendacion["materiales"])) +
                  ". <b>Tiempo sugerido:</b> " + escape(recomendacion["duracion"]) + ".", cuerpo),
        Spacer(1, 3),
    ]
    for i, paso in enumerate(recomendacion["pasos"], 1):
        bloques.append(Paragraph(f"<b>{i}.</b> {escape(paso)}", cuerpo))
    bloques.extend([Spacer(1, 7), Paragraph("VAMOS A PRACTICAR", etiqueta)])
    ficha = recomendacion["ficha"]
    if ficha["tipo"] == "planas":
        bloques.extend(RenglonPalabra(palabra) for palabra in ficha["palabras"])
        bloques.append(Paragraph("<b>Mi oración:</b>", cuerpo))
        bloques.append(Spacer(1, 12))
        bloques.append(Paragraph("________________________________________________________________________________", cuerpo))
    else:
        bloques.append(DibujoMotricidad(ficha))
    bloques.extend([Spacer(1, 8), Paragraph("<b>Para terminar:</b> " + escape(recomendacion["cierre"]), cuerpo)])
    documento.build(bloques, onFirstPage=_pie, onLaterPages=_pie)
    return salida.getvalue()
