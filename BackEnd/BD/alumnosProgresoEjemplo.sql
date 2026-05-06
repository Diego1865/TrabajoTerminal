-- Ejemplo de flujo de datos para un intento de ejercicio tutor
INSERT INTO Intentos (
    id_alumno, id_ejercicio_tutor, id_recomendacion,
    imagen_codificada, texto_detectado_ocr, fecha_envio
)
VALUES (
    1, 3, NULL,
    'base64...', 'El perro corre rapido', GETDATE()
);
-- id_intento generado: 5

-- 2. El módulo OCR/NLP inserta el análisis ortográfico
--    → se dispara trg_actualizar_progreso_ortografia
INSERT INTO Analisis_Ortografico (
    id_intento, cantidad_errores, ortografia_score
)
VALUES (5, 1, 8.50);
-- Progreso_Alumno: promedio_ortografia se actualiza a AVG(anterior, 8.50)

-- 3. El módulo OCR inserta el análisis caligráfico
--    → se dispara trg_actualizar_progreso_caligrafico
INSERT INTO Analisis_Caligrafico (
    id_intento, alineacion_score, tamano_letra_score,
    espaciado_score, inclinacion_score
)
VALUES (5, 7.00, 8.00, 7.50, 6.50);
-- Progreso_Alumno: promedios caligráficos se actualizan

-- 4. Estado final de Progreso_Alumno para id_alumno = 1
SELECT * FROM Progreso_Alumno WHERE id_alumno = 1;
-- promedio_ortografia  : 8.75  (promedio de intentos anteriores + 8.50)
-- promedio_aliniacion  : 7.25  (promedio de intentos anteriores + 7.00)
-- promedio_tamano_letra: 8.00
-- promedio_espaciado   : 7.75
-- prommedio_inclinacion: 6.75
-- fecha_modificacion   : (fecha actual)
