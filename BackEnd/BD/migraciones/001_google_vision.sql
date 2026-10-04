-- Ejecutar una vez sobre la base existente antes de iniciar el backend actualizado.
SET XACT_ABORT ON;
BEGIN TRANSACTION;
IF COL_LENGTH('dbo.Intentos', 'resultado_ocr_json') IS NULL
    ALTER TABLE dbo.Intentos ADD resultado_ocr_json NVARCHAR(MAX) NULL;
ALTER TABLE dbo.Intentos ALTER COLUMN texto_detectado_ocr NVARCHAR(MAX) NULL;
COMMIT TRANSACTION;
