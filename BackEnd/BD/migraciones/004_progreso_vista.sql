USE TT;
GO

-- Índices para consultar los intentos por alumno y por asignación (antes solo había PK).
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Intentos_alumno' AND object_id = OBJECT_ID('dbo.Intentos'))
    CREATE INDEX IX_Intentos_alumno ON dbo.Intentos (id_alumno, fecha_envio);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Intentos_ejercicio_tutor' AND object_id = OBJECT_ID('dbo.Intentos'))
    CREATE INDEX IX_Intentos_ejercicio_tutor ON dbo.Intentos (id_ejercicio_tutor);
GO

-- Progreso del alumno calculado al momento con lo que el tutor confirmó al calificar
-- (Analisis_Ortografico y Analisis_Caligrafico). Sustituye a la tabla Progreso_Alumno,
-- que guardaba una copia de estos promedios y había que mantener sincronizada.
CREATE OR ALTER VIEW dbo.vw_Progreso_Alumno AS
WITH ortografia AS (
    SELECT i.id_alumno, CAST(AVG(ao.ortografia_score) AS DECIMAL(5,2)) AS promedio_ortografia
    FROM dbo.Analisis_Ortografico ao
    JOIN dbo.Intentos i ON i.id_intento = ao.id_intento
    WHERE ao.ortografia_score IS NOT NULL
    GROUP BY i.id_alumno
), caligrafia AS (
    SELECT i.id_alumno,
        CAST(AVG(ac.alineacion_score) AS DECIMAL(5,2)) AS alineacion_score,
        CAST(AVG(ac.tamano_letra_score) AS DECIMAL(5,2)) AS tamano_letra_score,
        CAST(AVG(ac.espaciado_score) AS DECIMAL(5,2)) AS espaciado_score,
        CAST(AVG(ac.inclinacion_score) AS DECIMAL(5,2)) AS inclinacion_score
    FROM dbo.Analisis_Caligrafico ac
    JOIN dbo.Intentos i ON i.id_intento = ac.id_intento
    GROUP BY i.id_alumno
)
SELECT a.id_alumno, a.id_tutor, u.id_estatus,
    u.nombre, u.apellido_paterno, a.apellido_materno,
    o.promedio_ortografia,
    c.alineacion_score, c.tamano_letra_score, c.espaciado_score, c.inclinacion_score,
    l.promedio_legibilidad,
    -- Sin uno de los dos promedios, el general es el que haya.
    COALESCE((o.promedio_ortografia + l.promedio_legibilidad) / 2,
             o.promedio_ortografia, l.promedio_legibilidad) AS promedio_general
FROM dbo.Alumno a
JOIN dbo.Usuario u ON u.id_usuario = a.id_usuario
LEFT JOIN ortografia o ON o.id_alumno = a.id_alumno
LEFT JOIN caligrafia c ON c.id_alumno = a.id_alumno
CROSS APPLY (SELECT (c.alineacion_score + c.tamano_letra_score + c.espaciado_score
                     + c.inclinacion_score) / 4 AS promedio_legibilidad) l;
GO

-- Historial_Alumno solo se escribía (nunca se leía) y Progreso_Alumno queda sustituida por la vista.
IF OBJECT_ID('dbo.Historial_Alumno', 'U') IS NOT NULL
    DROP TABLE dbo.Historial_Alumno;
GO
IF OBJECT_ID('dbo.Progreso_Alumno', 'U') IS NOT NULL
    DROP TABLE dbo.Progreso_Alumno;
GO
