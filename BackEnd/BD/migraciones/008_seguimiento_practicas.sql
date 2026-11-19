-- La evidencia y la validación pertenecen a la recomendación que recibió el alumno.
IF COL_LENGTH('dbo.Recomendacion', 'imagen_practica') IS NULL
    ALTER TABLE dbo.Recomendacion ADD imagen_practica VARCHAR(MAX) NULL;
IF COL_LENGTH('dbo.Recomendacion', 'fecha_completada') IS NULL
    ALTER TABLE dbo.Recomendacion ADD fecha_completada DATETIME2 NULL;
IF COL_LENGTH('dbo.Recomendacion', 'fecha_validada') IS NULL
    ALTER TABLE dbo.Recomendacion ADD fecha_validada DATETIME2 NULL;
IF COL_LENGTH('dbo.Recomendacion', 'id_tutor_validador') IS NULL
    ALTER TABLE dbo.Recomendacion ADD id_tutor_validador INT NULL
        CONSTRAINT FK_Recomendacion_TutorValidador REFERENCES dbo.Tutor(id_tutor);
