CREATE TRIGGER trg_actualizar_progreso_ortografia
ON Analisis_Ortografico
AFTER INSERT AS
BEGIN
SET NOCOUNT ON;
DECLARE @id_alumno INT;
DECLARE @nuevo_promedio DECIMAL(5,2);
SELECT @id_alumno = i.id_alumno FROM inserted ins
INNER JOIN Intentos i ON i.id_intento = ins.id_intento;
SELECT @nuevo_promedio = AVG(ao.ortografia_score) FROM Analisis_Ortografico ao
INNER JOIN Intentos i ON i.id_intento = ao.id_intento WHERE i.id_alumno = @id_alumno
AND ao.ortografia_score IS NOT NULL;
IF EXISTS (
SELECT 1 FROM Progreso_Alumno
WHERE id_alumno = @id_alumno )
BEGIN
UPDATE Progreso_Alumno
SET promedio_ortografia = @nuevo_promedio , fecha_modificacion = GETDATE()
WHERE id_alumno = @id_alumno; END
ELSE BEGIN
INSERT INTO Progreso_Alumno ( id_alumno ,
promedio_ortografia , promedio_aliniacion ,
promedio_tamano_letra , promedio_espaciado ,
prommedio_inclinacion ,fecha_modificacion
)
VALUES (
@id_alumno , @nuevo_promedio ,
NULL , NULL , NULL , NULL , GETDATE ()
);
END
END; GO


CREATE TRIGGER trg_actualizar_progreso_caligrafico 
ON Analisis_Caligrafico
AFTER INSERT AS
BEGIN
SET NOCOUNT ON;
DECLARE @id_alumno INT;
DECLARE @prom_alineacion DECIMAL(5,2); DECLARE @prom_tamano_letra DECIMAL(5,2);
DECLARE @prom_espaciado DECIMAL(5,2); DECLARE @prom_inclinacion DECIMAL(5,2);
SELECT @id_alumno = i.id_alumno
FROM inserted ins
INNER JOIN Intentos i ON i.id_intento = ins.id_intento;
SELECT
@prom_alineacion = AVG(ac.alineacion_score), @prom_tamano_letra = AVG(ac.tamano_letra_score),
@prom_espaciado = AVG(ac.espaciado_score), @prom_inclinacion = AVG(ac.inclinacion_score)
FROM Analisis_Caligrafico ac
INNER JOIN Intentos i ON i.id_intento = ac.id_intento
WHERE i.id_alumno = @id_alumno
AND ac.alineacion_score IS NOT NULL AND ac.tamano_letra_score IS NOT NULL
AND ac.espaciado_score IS NOT NULL AND ac.inclinacion_score IS NOT NULL;
IF EXISTS (
SELECT 1 FROM Progreso_Alumno WHERE id_alumno = @id_alumno
)
BEGIN
UPDATE Progreso_Alumno
SET promedio_aliniacion = @prom_alineacion ,
promedio_tamano_letra = @prom_tamano_letra , promedio_espaciado = @prom_espaciado ,
prommedio_inclinacion = @prom_inclinacion , fecha_modificacion = GETDATE()
WHERE id_alumno = @id_alumno; END
ELSE BEGIN
INSERT INTO Progreso_Alumno ( id_alumno ,
promedio_ortografia , promedio_aliniacion ,
promedio_tamano_letra , promedio_espaciado ,
prommedio_inclinacion , fecha_modificacion
)
VALUES (
@id_alumno , NULL ,
@prom_alineacion , @prom_tamano_letra ,
@prom_espaciado , @prom_inclinacion ,
GETDATE () );
END 
END; 
GO