USE TT;
GO

-- NULL conserva el catálogo compartido existente; los dictados tienen dueño.
IF COL_LENGTH('dbo.Ejercicios', 'id_tutor_creador') IS NULL
BEGIN
    ALTER TABLE dbo.Ejercicios ADD id_tutor_creador INT NULL
        CONSTRAINT FK_Ejercicios_Creador REFERENCES dbo.Tutor(id_tutor);
END;
GO
