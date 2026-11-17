-- Recomendaciones opcionales. No se insertan en el catálogo de ejercicios asignables.
SET XACT_ABORT ON;
BEGIN TRANSACTION;
IF COL_LENGTH('dbo.Recomendacion', 'detalle_json') IS NULL
    ALTER TABLE dbo.Recomendacion ADD detalle_json NVARCHAR(MAX) NULL;

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Recomendacion_detalle_json')
    EXEC(N'ALTER TABLE dbo.Recomendacion ADD CONSTRAINT CK_Recomendacion_detalle_json
        CHECK (detalle_json IS NULL OR ISJSON(detalle_json) = 1)');

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Recomendacion_intento'
               AND object_id = OBJECT_ID('dbo.Recomendacion'))
    CREATE INDEX IX_Recomendacion_intento ON dbo.Recomendacion (id_intento);

IF NOT EXISTS (SELECT 1 FROM dbo.Actividad_Sugerida
               WHERE tipo_error = 'promedio_legibilidad_bajo' AND tipo_ejercicio = 'retroalimentacion')
    INSERT INTO dbo.Actividad_Sugerida (tipo_error, descripcion, tipo_ejercicio, contenido)
    VALUES ('promedio_legibilidad_bajo', 'Mi letra sobre el renglón', 'retroalimentacion',
            'https://recursostic.net/fichas-de-caligrafia-para-imprimir/');

IF NOT EXISTS (SELECT 1 FROM dbo.Actividad_Sugerida
               WHERE tipo_error = 'promedio_ortografia_bajo' AND tipo_ejercicio = 'retroalimentacion')
    INSERT INTO dbo.Actividad_Sugerida (tipo_error, descripcion, tipo_ejercicio, contenido)
    VALUES ('promedio_ortografia_bajo', 'Planas de palabras y una oración', 'retroalimentacion',
            'https://edutools.tools/herramientas/generador-caligrafia/');
COMMIT TRANSACTION;
