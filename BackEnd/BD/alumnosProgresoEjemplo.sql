-- Insertar alumnos de ejemplo en la tabla Usuario con tipo_usuario = 'alumno'
INSERT INTO Usuario (nombre, apellido_paterno, apellido_materno, username, contrasena_cifrada, tipo_usuario, grado, grupo, id_tutor, id_estatus)
VALUES
('Juan', 'García', 'López', 'juangarc23', 'hashed_password_1', 'alumno', '3', 'A', 2, 1),
('María', 'Rodríguez', 'Martínez', 'mariarod45', 'hashed_password_2', 'alumno', '3', 'A', 2, 1),
('Carlos', 'Hernández', 'Pérez', 'carloshe78', 'hashed_password_3', 'alumno', '3', 'B', 1, 1),
('Ana', 'López', 'González', 'analopez12', 'hashed_password_4', 'alumno', '4', 'A', 1, 1),
('Luis', 'Martínez', 'Sánchez', 'luismart67', 'hashed_password_5', 'alumno', '4', 'B', 1, 1),
('Sofia', 'Pérez', 'Ramírez', 'sofiape89', 'hashed_password_6', 'alumno', '4', 'A', 1, 1),
('Diego', 'González', 'Torres', 'diegogon34', 'hashed_password_7', 'alumno', '3', 'C', 1, 1),
('Laura', 'Fernández', 'Díaz', 'laurafe56', 'hashed_password_8', 'alumno', '3', 'A', 1, 1),
('Miguel', 'Sánchez', 'Ruiz', 'miguelsa90', 'hashed_password_9', 'alumno', '4', 'B', 1, 1),
('Isabel', 'Jiménez', 'Vargas', 'isabelji41', 'hashed_password_10', 'alumno', '3', 'A', 1, 1),
('Roberto', 'Morales', 'Campos', 'robertomo28', 'hashed_password_11', 'alumno', '4', 'C', 1, 1),
('Valentina', 'Romero', 'Navarro', 'valentinar73', 'hashed_password_12', 'alumno', '3', 'A', 1, 1),
('Fernando', 'Castro', 'Ortiz', 'fernandoca55', 'hashed_password_13', 'alumno', '4', 'B', 1, 1),
('Camila', 'Núñez', 'Flores', 'camilanu82', 'hashed_password_14', 'alumno', '3', 'A', 1, 1),
('Pablo', 'Vargas', 'Medina', 'pablovar19', 'hashed_password_15', 'alumno', '4', 'C', 1, 1),
('Gabriela', 'Aguilar', 'Salazar', 'gabrielag64', 'hashed_password_16', 'alumno', '3', 'B', 1, 1),
('Andrés', 'Ibáñez', 'Reyes', 'andresib37', 'hashed_password_17', 'alumno', '4', 'B', 1, 1),
('Mariana', 'Domínguez', 'Vega', 'marianadom51', 'hashed_password_18', 'alumno', '3', 'A', 1, 1),
('Ricardo', 'Escobar', 'Montes', 'ricardoes72', 'hashed_password_19', 'alumno', '4', 'C', 1, 1),
('Alejandra', 'Quintero', 'Acosta', 'alejandraq26', 'hashed_password_20', 'alumno', '3', 'A', 1, 1),
('Francisco', 'Salinas', 'Bernal', 'franciscosal48', 'hashed_password_21', 'alumno', '4', 'B', 1, 1),
('Daniela', 'Medrano', 'Gómez', 'danielamed93', 'hashed_password_22', 'alumno', '3', 'A', 1, 1),
('Javier', 'Cortés', 'Lara', 'javiercor85', 'hashed_password_23', 'alumno', '4', 'C', 1, 1),
('Natalia', 'Benavides', 'Hidalgo', 'nataliaben61', 'hashed_password_24', 'alumno', '3', 'A', 1, 1),
('Eduardo', 'Molina', 'Ponce', 'eduardomol39', 'hashed_password_25', 'alumno', '4', 'B', 1, 1),
('Lucía', 'Vázquez', 'Arias', 'luciavaz76', 'hashed_password_26', 'alumno', '3', 'A', 1, 1),
('Mauricio', 'Riquelme', 'Carrillo', 'mauriciorit44', 'hashed_password_27', 'alumno', '4', 'C', 1, 1),
('Catalina', 'Cifuentes', 'Durán', 'catalinacif88', 'hashed_password_28', 'alumno', '3', 'A', 1, 1),
('Rodrigo', 'Valenzuela', 'Espinoza', 'rodrigoval57', 'hashed_password_29', 'alumno', '4', 'B', 1, 1),
('Francisca', 'Tapia', 'Bravo', 'franciscatap70', 'hashed_password_30', 'alumno', '3', 'A', 1, 1);


--- Insertar Historial de progreso del alumno solo es ejemplo
-- Ahora usando id_usuario en lugar de id_usuario

INSERT INTO Historial_Alumno (id_usuario, promedio_ortografia, alineacion_score, tamano_letra_score, espaciado_score, inclinacion_score, fecha)
VALUES
-- Alumno 1
(5, 8.75, 7.50, 8.25, 7.80, 8.40, '2026-03-15 10:30:00'),  -- Se requiere obtener id_usuario correcto de Usuario
(5, 8.90, 7.75, 8.50, 8.10, 8.65, '2026-03-22 11:15:00'),
(5, 9.15, 8.00, 8.75, 8.35, 8.90, '2026-03-29 09:45:00'),
-- Alumno 2
(2, 7.60, 6.80, 7.40, 7.20, 7.50, '2026-03-16 10:30:00'),
(2, 7.85, 7.05, 7.65, 7.45, 7.75, '2026-03-23 11:15:00'),
(2, 8.10, 7.30, 7.90, 7.70, 8.00, '2026-03-30 09:45:00'),
-- Alumno 3
(3, 9.05, 8.20, 8.90, 8.60, 9.10, '2026-03-17 10:30:00'),
(3, 9.30, 8.45, 9.15, 8.85, 9.35, '2026-03-24 11:15:00'),
(3, 9.50, 8.70, 9.40, 9.10, 9.55, '2026-03-31 09:45:00'),
-- Alumno 4
(4, 6.85, 6.20, 6.75, 6.50, 6.90, '2026-03-18 10:30:00'),
(4, 7.10, 6.45, 7.00, 6.75, 7.15, '2026-03-25 11:15:00'),
(4, 7.35, 6.70, 7.25, 7.00, 7.40, '2026-04-01 09:45:00'),
-- Alumno 5
(5, 8.40, 7.90, 8.30, 8.00, 8.50, '2026-03-19 10:30:00'),
(5, 8.65, 8.15, 8.55, 8.25, 8.75, '2026-03-26 11:15:00'),
(5, 8.90, 8.40, 8.80, 8.50, 9.00, '2026-04-02 09:45:00'),
-- Alumno 6
(6, 7.95, 7.35, 7.85, 7.60, 8.05, '2026-03-20 10:30:00'),
(6, 8.20, 7.60, 8.10, 7.85, 8.30, '2026-03-27 11:15:00'),
(6, 8.45, 7.85, 8.35, 8.10, 8.55, '2026-04-03 09:45:00'),
-- Alumno 7
(7, 6.50, 5.95, 6.40, 6.15, 6.60, '2026-03-21 10:30:00'),
(7, 6.75, 6.20, 6.65, 6.40, 6.85, '2026-03-28 11:15:00'),
(7, 7.00, 6.45, 6.90, 6.65, 7.10, '2026-04-04 09:45:00'),
-- Alumno 8
(8, 9.20, 8.60, 9.10, 8.80, 9.25, '2026-03-15 14:20:00'),
(8, 9.40, 8.85, 9.35, 9.05, 9.45, '2026-03-22 14:20:00'),
(8, 9.60, 9.10, 9.55, 9.30, 9.65, '2026-03-29 14:20:00'),
-- Alumno 9
(9, 7.70, 7.15, 7.60, 7.35, 7.80, '2026-03-16 14:20:00'),
(9, 7.95, 7.40, 7.85, 7.60, 8.05, '2026-03-23 14:20:00'),
(9, 8.20, 7.65, 8.10, 7.85, 8.30, '2026-03-30 14:20:00'),
-- Alumno 10
(10, 8.55, 8.00, 8.45, 8.20, 8.65, '2026-03-17 14:20:00'),
(10, 8.80, 8.25, 8.70, 8.45, 8.90, '2026-03-24 14:20:00'),
(10, 9.05, 8.50, 8.95, 8.70, 9.15, '2026-03-31 14:20:00'),
-- Alumno 11
(11, 6.95, 6.35, 6.85, 6.60, 7.05, '2026-03-18 14:20:00'),
(11, 7.20, 6.60, 7.10, 6.85, 7.30, '2026-03-25 14:20:00'),
(11, 7.45, 6.85, 7.35, 7.10, 7.55, '2026-04-01 14:20:00'),
-- Alumno 12
(12, 9.35, 8.75, 9.25, 8.95, 9.40, '2026-03-19 14:20:00'),
(12, 9.55, 9.00, 9.50, 9.20, 9.60, '2026-03-26 14:20:00'),
(12, 9.75, 9.25, 9.70, 9.45, 9.80, '2026-04-02 14:20:00'),
-- Alumno 13
(13, 7.35, 6.75, 7.25, 7.00, 7.45, '2026-03-20 14:20:00'),
(13, 7.60, 7.00, 7.50, 7.25, 7.70, '2026-03-27 14:20:00'),
(13, 7.85, 7.25, 7.75, 7.50, 7.95, '2026-04-03 14:20:00'),
-- Alumno 14
(14, 8.65, 8.10, 8.55, 8.30, 8.75, '2026-03-21 14:20:00'),
(14, 8.90, 8.35, 8.80, 8.55, 9.00, '2026-03-28 14:20:00'),
(14, 9.15, 8.60, 9.05, 8.80, 9.25, '2026-04-04 14:20:00'),
-- Alumno 15
(15, 6.70, 6.10, 6.60, 6.35, 6.80, '2026-03-15 15:45:00'),
(15, 6.95, 6.35, 6.85, 6.60, 7.05, '2026-03-22 15:45:00'),
(15, 7.20, 6.60, 7.10, 6.85, 7.30, '2026-03-29 15:45:00'),
-- Alumno 16
(16, 9.10, 8.50, 9.00, 8.70, 9.20, '2026-03-16 15:45:00'),
(16, 9.35, 8.75, 9.25, 8.95, 9.45, '2026-03-23 15:45:00'),
(16, 9.55, 9.00, 9.45, 9.20, 9.65, '2026-03-30 15:45:00'),
-- Alumno 17
(17, 7.45, 6.85, 7.35, 7.10, 7.55, '2026-03-17 15:45:00'),
(17, 7.70, 7.10, 7.60, 7.35, 7.80, '2026-03-24 15:45:00'),
(17, 7.95, 7.35, 7.85, 7.60, 8.05, '2026-03-31 15:45:00'),
-- Alumno 18
(18, 8.75, 8.15, 8.65, 8.40, 8.85, '2026-03-18 15:45:00'),
(18, 9.00, 8.40, 8.90, 8.65, 9.10, '2026-03-25 15:45:00'),
(18, 9.25, 8.65, 9.15, 8.90, 9.35, '2026-04-01 15:45:00'),
-- Alumno 19
(19, 6.60, 6.00, 6.50, 6.25, 6.70, '2026-03-19 15:45:00'),
(19, 6.85, 6.25, 6.75, 6.50, 6.95, '2026-03-26 15:45:00'),
(19, 7.10, 6.50, 7.00, 6.75, 7.20, '2026-04-02 15:45:00'),
-- Alumno 20
(20, 9.00, 8.40, 8.90, 8.60, 9.10, '2026-03-20 15:45:00'),
(20, 9.25, 8.65, 9.15, 8.85, 9.35, '2026-03-27 15:45:00'),
(20, 9.45, 8.90, 9.35, 9.10, 9.55, '2026-04-03 15:45:00'),
-- Alumno 21
(21, 7.55, 6.95, 7.45, 7.20, 7.65, '2026-03-21 15:45:00'),
(21, 7.80, 7.20, 7.70, 7.45, 7.90, '2026-03-28 15:45:00'),
(21, 8.05, 7.45, 7.95, 7.70, 8.15, '2026-04-04 15:45:00'),
-- Alumno 22
(22, 8.85, 8.25, 8.75, 8.50, 8.95, '2026-03-15 16:30:00'),
(22, 9.10, 8.50, 9.00, 8.75, 9.20, '2026-03-22 16:30:00'),
(22, 9.30, 8.75, 9.20, 9.00, 9.40, '2026-03-29 16:30:00'),
-- Alumno 23
(23, 7.25, 6.65, 7.15, 6.90, 7.35, '2026-03-16 16:30:00'),
(23, 7.50, 6.90, 7.40, 7.15, 7.60, '2026-03-23 16:30:00'),
(23, 7.75, 7.15, 7.65, 7.40, 7.85, '2026-03-30 16:30:00'),
-- Alumno 24
(24, 8.95, 8.35, 8.85, 8.60, 9.05, '2026-03-17 16:30:00'),
(24, 9.20, 8.60, 9.10, 8.85, 9.30, '2026-03-24 16:30:00'),
(24, 9.40, 8.85, 9.30, 9.10, 9.50, '2026-03-31 16:30:00'),
-- Alumno 25
(25, 6.80, 6.20, 6.70, 6.45, 6.90, '2026-03-18 16:30:00'),
(25, 7.05, 6.45, 6.95, 6.70, 7.15, '2026-03-25 16:30:00'),
(25, 7.30, 6.70, 7.20, 6.95, 7.40, '2026-04-01 16:30:00'),
-- Alumno 26
(26, 9.25, 8.65, 9.15, 8.85, 9.35, '2026-03-19 16:30:00'),
(26, 9.45, 8.90, 9.35, 9.10, 9.55, '2026-03-26 16:30:00'),
(26, 9.65, 9.15, 9.55, 9.35, 9.75, '2026-04-02 16:30:00'),
-- Alumno 27
(27, 7.15, 6.55, 7.05, 6.80, 7.25, '2026-03-20 16:30:00'),
(27, 7.40, 6.80, 7.30, 7.05, 7.50, '2026-03-27 16:30:00'),
(27, 7.65, 7.05, 7.55, 7.30, 7.75, '2026-04-03 16:30:00'),
-- Alumno 28
(28, 8.70, 8.10, 8.60, 8.35, 8.80, '2026-03-21 16:30:00'),
(28, 8.95, 8.35, 8.85, 8.60, 9.05, '2026-03-28 16:30:00'),
(28, 9.15, 8.60, 9.05, 8.85, 9.25, '2026-04-04 16:30:00'),
-- Alumno 29
(29, 6.75, 6.15, 6.65, 6.40, 6.85, '2026-03-15 17:15:00'),
(29, 7.00, 6.40, 6.90, 6.65, 7.10, '2026-03-22 17:15:00'),
(29, 7.25, 6.65, 7.15, 6.90, 7.35, '2026-03-29 17:15:00'),
-- Alumno 30
(30, 9.05, 8.45, 8.95, 8.65, 9.15, '2026-03-16 17:15:00'),
(30, 9.30, 8.70, 9.20, 8.90, 9.40, '2026-03-23 17:15:00'),
(30, 9.50, 8.95, 9.40, 9.15, 9.60, '2026-03-30 17:15:00');

-- Actualice el promedio y scores para prueba de alumnos en riesgo:
UPDATE Historial_Alumno SET promedio_ortografia = 3.45, alineacion_score = 2.80, tamano_letra_score = 3.20, espaciado_score = 2.90, inclinacion_score = 3.10 WHERE id_historial = 1;
UPDATE Historial_Alumno SET promedio_ortografia = 4.20, alineacion_score = 3.50, tamano_letra_score = 4.10, espaciado_score = 3.75, inclinacion_score = 4.05 WHERE id_historial = 2;
UPDATE Historial_Alumno SET promedio_ortografia = 5.15, alineacion_score = 4.40, tamano_letra_score = 5.05, espaciado_score = 4.75, inclinacion_score = 5.25 WHERE id_historial = 3;

UPDATE Historial_Alumno SET promedio_ortografia = 2.65, alineacion_score = 2.10, tamano_letra_score = 2.50, espaciado_score = 2.20, inclinacion_score = 2.75 WHERE id_historial = 10;
UPDATE Historial_Alumno SET promedio_ortografia = 3.50, alineacion_score = 2.85, tamano_letra_score = 3.40, espaciado_score = 3.10, inclinacion_score = 3.60 WHERE id_historial = 11;
UPDATE Historial_Alumno SET promedio_ortografia = 4.40, alineacion_score = 3.75, tamano_letra_score = 4.30, espaciado_score = 4.00, inclinacion_score = 4.50 WHERE id_historial = 12;

UPDATE Historial_Alumno SET promedio_ortografia = 1.85, alineacion_score = 1.50, tamano_letra_score = 1.75, espaciado_score = 1.60, inclinacion_score = 1.95 WHERE id_historial = 19;
UPDATE Historial_Alumno SET promedio_ortografia = 2.90, alineacion_score = 2.35, tamano_letra_score = 2.80, espaciado_score = 2.55, inclinacion_score = 3.05 WHERE id_historial = 20;
UPDATE Historial_Alumno SET promedio_ortografia = 3.95, alineacion_score = 3.25, tamano_letra_score = 3.85, espaciado_score = 3.55, inclinacion_score = 4.05 WHERE id_historial = 21;

UPDATE Historial_Alumno SET promedio_ortografia = 3.75, alineacion_score = 3.10, tamano_letra_score = 3.65, espaciado_score = 3.35, inclinacion_score = 3.85 WHERE id_historial = 31;
UPDATE Historial_Alumno SET promedio_ortografia = 4.55, alineacion_score = 3.90, tamano_letra_score = 4.45, espaciado_score = 4.15, inclinacion_score = 4.65 WHERE id_historial = 32;
UPDATE Historial_Alumno SET promedio_ortografia = 5.40, alineacion_score = 4.70, tamano_letra_score = 5.30, espaciado_score = 5.00, inclinacion_score = 5.50 WHERE id_historial = 33;

UPDATE Historial_Alumno SET promedio_ortografia = 2.35, alineacion_score = 1.85, tamano_letra_score = 2.25, espaciado_score = 1.95, inclinacion_score = 2.45 WHERE id_historial = 43;
UPDATE Historial_Alumno SET promedio_ortografia = 3.40, alineacion_score = 2.75, tamano_letra_score = 3.30, espaciado_score = 3.00, inclinacion_score = 3.50 WHERE id_historial = 44;
UPDATE Historial_Alumno SET promedio_ortografia = 4.35, alineacion_score = 3.65, tamano_letra_score = 4.25, espaciado_score = 3.95, inclinacion_score = 4.45 WHERE id_historial = 45;

UPDATE Historial_Alumno SET promedio_ortografia = 4.10, alineacion_score = 3.45, tamano_letra_score = 4.00, espaciado_score = 3.70, inclinacion_score = 4.20 WHERE id_historial = 55;
UPDATE Historial_Alumno SET promedio_ortografia = 5.05, alineacion_score = 4.35, tamano_letra_score = 4.95, espaciado_score = 4.65, inclinacion_score = 5.15 WHERE id_historial = 56;
UPDATE Historial_Alumno SET promedio_ortografia = 5.90, alineacion_score = 5.20, tamano_letra_score = 5.80, espaciado_score = 5.50, inclinacion_score = 6.00 WHERE id_historial = 57;


-- Progreso alumno, posiblemente lo ocupemos esto para el backend:
MERGE INTO Progreso_Alumno AS target
USING (
    SELECT 
        id_usuario,
        AVG(promedio_ortografia) AS promedio_ortografia,
        AVG(alineacion_score) AS alineacion_score,
        AVG(tamano_letra_score) AS tamano_letra_score,
        AVG(espaciado_score) AS espaciado_score,
        AVG(inclinacion_score) AS inclinacion_score
    FROM Historial_Alumno
    GROUP BY id_usuario
) AS source
ON target.id_usuario = source.id_usuario
WHEN MATCHED THEN
    UPDATE SET 
        promedio_ortografia = source.promedio_ortografia,
        alineacion_score = source.alineacion_score,
        tamano_letra_score = source.tamano_letra_score,
        espaciado_score = source.espaciado_score,
        inclinacion_score = source.inclinacion_score,
        fecha_modificacion = GETDATE()
WHEN NOT MATCHED THEN
    INSERT (id_usuario, promedio_ortografia, alineacion_score, tamano_letra_score, espaciado_score, inclinacion_score, fecha_modificacion)
    VALUES (source.id_usuario, source.promedio_ortografia, source.alineacion_score, source.tamano_letra_score, source.espaciado_score, source.inclinacion_score, GETDATE());

SELECT * FROM Progreso_Alumno;


WITH PromedialidadAlumnos AS (
    SELECT a.id_usuario, a.nombre, a.apellido_paterno, a.apellido_materno, 
           p.promedio_ortografia,
           (p.alineacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4 AS promedio_legibilidad
    FROM Usuario tu
    JOIN Usuario a ON tu.id_usuario = a.id_tutor AND a.tipo_usuario = 'alumno'
    JOIN Progreso_Alumno p ON a.id_usuario = p.id_usuario
    WHERE tu.id_usuario = 1 -- Reemplaza con el ID del tutor específico que deseas consultar
)
SELECT *
FROM PromedialidadAlumnos
WHERE promedio_ortografia < 6.0 
   OR promedio_legibilidad < 6.0


-- Consulta para obtener todo el progreso.

SELECT 
    CASE 
        WHEN promedio_ortografia > 8 THEN 'Buen Promedio'
        WHEN promedio_ortografia BETWEEN 6 AND 8 THEN 'Promedio Regular'
        ELSE 'Mal Promedio'
    END AS categoria,
    COUNT(DISTINCT p.id_usuario) AS cantidad_alumnos
FROM Usuario tu
JOIN Usuario a ON tu.id_usuario = a.id_tutor AND a.tipo_usuario = 'alumno'
JOIN Progreso_Alumno p ON a.id_usuario = p.id_usuario
WHERE tu.id_usuario = 1 -- Reemplaza con el ID del tutor específico que deseas
GROUP BY 
    CASE 
        WHEN promedio_ortografia > 8 THEN 'Buen Promedio'
        WHEN promedio_ortografia BETWEEN 6 AND 8 THEN 'Promedio Regular'
        ELSE 'Mal Promedio'
    END
ORDER BY cantidad_alumnos DESC;


WITH ProgresoLegibilidad AS(
    SELECT
        (alineacion_score + tamano_letra_score + espaciado_score + inclinacion_score) / 4 AS promedio_legibilidad
    FROM Usuario tu
    JOIN Usuario a ON tu.id_usuario = a.id_tutor AND a.tipo_usuario = 'alumno'
    JOIN Progreso_Alumno p ON a.id_usuario = p.id_usuario
    WHERE tu.id_usuario = 1 -- Reemplaza con el ID del tutor específico que
    
)
SELECT 
    CASE 
        WHEN promedio_legibilidad > 8 THEN 'Buena Legibilidad'
        WHEN promedio_legibilidad BETWEEN 6 AND 8 THEN 'Legibilidad Regular'
        ELSE 'Mala Legibilidad'
    END AS categoria,
    COUNT(*) AS cantidad_alumnos
FROM ProgresoLegibilidad
GROUP BY 
    CASE 
        WHEN promedio_legibilidad > 8 THEN 'Buena Legibilidad'
        WHEN promedio_legibilidad BETWEEN 6 AND 8 THEN 'Legibilidad Regular'
        ELSE 'Mala Legibilidad'
    END
ORDER BY cantidad_alumnos DESC;


WITH PromedialidadAlumnos AS (
                SELECT a.id_usuario, a.nombre, a.apellido_paterno, a.apellido_materno, 
                    p.promedio_ortografia,
                    (p.alineacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4 AS promedio_legibilidad
                FROM Usuario a
                JOIN Progreso_Alumno p ON a.id_usuario = p.id_usuario
                WHERE a.id_tutor = 1 AND a.tipo_usuario = 'alumno'
            )
            SELECT *
            FROM PromedialidadAlumnos
            WHERE promedio_ortografia > 8.0 
            AND promedio_legibilidad > 8.0;


WITH PromedialidadAlumnos AS (
                SELECT a.id_usuario, a.nombre, a.apellido_paterno, a.apellido_materno, 
                    p.promedio_ortografia,
                    (p.alineacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4 AS promedio_legibilidad
                FROM Usuario a
                JOIN Progreso_Alumno p ON a.id_usuario = p.id_usuario
                WHERE a.id_tutor = 1 AND a.tipo_usuario = 'alumno'
            )
            SELECT *
            FROM PromedialidadAlumnos
            where promedio_ortografia + promedio_legibilidad / 2 >= 6.0
            or promedio_ortografia + promedio_legibilidad / 2 <= 8.0;


WITH PromedialidadAlumnos AS (
                SELECT a.id_usuario, a.nombre, a.apellido_paterno, a.apellido_materno, 
                    p.promedio_ortografia,
                    (p.alineacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4 AS promedio_legibilidad
                FROM Usuario a
                JOIN Progreso_Alumno p ON a.id_usuario = p.id_usuario
                WHERE a.id_tutor = 1 AND a.tipo_usuario = 'alumno'
            )
            SELECT *
            FROM PromedialidadAlumnos
            WHERE promedio_ortografia + promedio_legibilidad / 2 < 6.0;

WITH PromedialidadAlumnos AS (
                SELECT a.id_usuario, a.nombre, a.apellido_paterno, a.apellido_materno, 
                    p.promedio_ortografia,
                    (p.alineacion_score + p.tamano_letra_score + p.espaciado_score + p.inclinacion_score) / 4 AS promedio_legibilidad
                FROM Usuario a
                JOIN Progreso_Alumno p ON a.id_usuario = p.id_usuario
                WHERE a.id_tutor = 1 AND a.tipo_usuario = 'alumno'
            )
            SELECT *
            FROM PromedialidadAlumnos
            where (promedio_ortografia + promedio_legibilidad) / 2 > 8.0;
            

SELECT * from Progreso_Alumno

