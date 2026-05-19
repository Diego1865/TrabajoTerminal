CONSTRAINT UQ_Usuarios_usuario UNIQUE (usuario),

CONSTRAINT UQ_Tutor_correo

UNIQUE (correo),

CREATE UNIQUE INDEX UQ_Intentos_original
ON Intentos (id_alumno , id_ejercicio_tutor)
WHERE id_recomendacion IS NULL;
CREATE UNIQUE INDEX UQ_ET_activo
ON Ejercicio_Tutor (id_tutor , id_ejercicio)
WHERE id_estatus = 1;
CONSTRAINT UQ_Analisis_Ort_intento UNIQUE (id_intento),
CONSTRAINT UQ_Analisis_Cal_intento
UNIQUE (id_intento)