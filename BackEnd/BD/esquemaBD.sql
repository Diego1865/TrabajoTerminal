CREATE DATABASE TT;
GO

USE TT;
GO

SET QUOTED_IDENTIFIER ON;
GO

-- Estatus (Activo, Inactivo, Desactivado, etc.)
IF OBJECT_ID('Estatus', 'U') IS NULL
CREATE TABLE Estatus (
    id_estatus   INT           NOT NULL IDENTITY(1,1),
    descripcion  VARCHAR(15)   NOT NULL,
    CONSTRAINT PK_Estatus PRIMARY KEY (id_estatus)
);

-- Usuarios
IF OBJECT_ID('Usuarios', 'U') IS NULL
CREATE TABLE Usuarios (
    id_usuario            INT           IDENTITY(1,1) NOT NULL,
    nombre                VARCHAR(50)   NOT NULL,
    usuario               VARCHAR(50)   NOT NULL,
    contrasena_cifrada    VARCHAR(255)  NOT NULL,
    tipo_usuario          VARCHAR(30)   NOT NULL,
    fecha_registro        DATETIME      NOT NULL DEFAULT GETDATE(),
    id_estatus            INT           NOT NULL,

    CONSTRAINT PK_Usuarios PRIMARY KEY (id_usuario),

    -- Usuario único
    CONSTRAINT UQ_Usuarios_usuario UNIQUE (usuario),

    -- Relación con Estatus
    CONSTRAINT FK_Usuarios_Estatus 
        FOREIGN KEY (id_estatus) 
        REFERENCES Estatus(id_estatus),

    CONSTRAINT UQ_Usuarios_usuario UNIQUE (usuario)
);
GO


-- Tutor
IF OBJECT_ID('Tutor', 'U') IS NULL
CREATE TABLE Tutor (
    id_tutor      INT           IDENTITY(1,1) NOT NULL,   
    correo        VARCHAR(100)   NOT NULL,
    id_usuario    INT           NOT NULL,

    CONSTRAINT PK_Tutor PRIMARY KEY (id_tutor),

    -- Correo único
    CONSTRAINT UQ_Tutor_correo UNIQUE (correo),

    -- Relación con Usuarios
    CONSTRAINT FK_Tutor_Usuario 
        FOREIGN KEY (id_usuario) 
        REFERENCES Usuarios(id_usuario)
);
GO

-- Alumno

IF OBJECT_ID('Alumno', 'U') IS NULL
CREATE TABLE Alumno (
    id_alumno     INT           IDENTITY(1,1) NOT NULL,
    grado         VARCHAR(15)   NOT NULL,
    grupo         VARCHAR(15)   NOT NULL,
    id_tutor      INT           NOT NULL,
    id_usuario    INT           NOT NULL,

    CONSTRAINT PK_Alumno PRIMARY KEY (id_alumno),

    -- Relación con Tutor
    CONSTRAINT FK_Alumno_Tutor 
        FOREIGN KEY (id_tutor) 
        REFERENCES Tutor(id_tutor),

    -- Relación con Usuarios
    CONSTRAINT FK_Alumno_Usuario 
        FOREIGN KEY (id_usuario) 
        REFERENCES Usuarios(id_usuario)
);
GO

-- Ejercicios 
IF OBJECT_ID('Ejercicios', 'U') IS NULL
CREATE TABLE Ejercicios (
    id_ejercicio     INT           NOT NULL IDENTITY(1,1),
    titulo           VARCHAR(150)  NOT NULL,
    descripcion      VARCHAR(MAX)  NOT NULL,              
    tipo             VARCHAR(30)   NOT NULL,
    contenido_base   VARCHAR(MAX)  NOT NULL,
    id_estatus       INT           NOT NULL DEFAULT 1,
    CONSTRAINT PK_Ejercicios        PRIMARY KEY (id_ejercicio),
    CONSTRAINT FK_Ejercicios_Estatus FOREIGN KEY (id_estatus) REFERENCES Estatus(id_estatus)
);

-- Ejercicio_Tutor (tabla de asociación M:N con atributos propios)
IF OBJECT_ID('Ejercicio_Tutor', 'U') IS NULL
CREATE TABLE Ejercicio_Tutor (
    id_ejercicio_tutor    INT           IDENTITY(1,1) NOT NULL,
    id_tutor              INT           NOT NULL,
    id_ejercicio          INT           NOT NULL,
    fecha_asignacion      DATETIME      NOT NULL DEFAULT GETDATE(),
    fecha_limite          DATETIME      NULL,
    id_estatus            INT           NOT NULL,
    CONSTRAINT PK_Ejercicio_Tutor PRIMARY KEY (id_ejercicio_tutor),
    CONSTRAINT FK_EjercicioTutor_Tutor
        FOREIGN KEY (id_tutor)
        REFERENCES Tutor(id_tutor),
    CONSTRAINT FK_EjercicioTutor_Ejercicio
        FOREIGN KEY (id_ejercicio)
        REFERENCES Ejercicio(id_ejercicio),
    CONSTRAINT FK_EjercicioTutor_Estatus
        FOREIGN KEY (id_estatus)
        REFERENCES Estatus(id_estatus)   
);
GO

CREATE UNIQUE INDEX UQ_ET_activo
    ON Ejercicio_Tutor (id_tutor, id_ejercicio)
    WHERE id_estatus = 1;

--  Intentos 
IF OBJECT_ID('Intentos', 'U') IS NULL
CREATE TABLE Intentos (
    id_intento           INT         IDENTITY(1,1) NOT NULL,
    id_alumno            INT         NOT NULL,         
    id_ejercicio_tutor   INT         NOT NULL,
    id_recomendacion     INT         NULL,
    imagen_codificada    VARCHAR(MAX) NOT NULL,            
    texto_detectado_ocr  VARCHAR(MAX)    NULL,           
    fecha_envio          DATETIME2   NOT NULL DEFAULT GETDATE(),
    retroalimentacion    VARCHAR(MAX)    NULL,           
    CONSTRAINT PK_Intentos          PRIMARY KEY (id_intento),
    CONSTRAINT FK_Intentos_alumno  FOREIGN KEY (id_alumno)    REFERENCES Alumno(id_alumno),
    CONSTRAINT FK_Intentos_ET       FOREIGN KEY (id_ejercicio_tutor) REFERENCES Ejercicios_Tutor(id_ejercicio_tutor),
    CONSTRAINT FK_Intentos_recomendacion FOREIGN KEY (id_recomendacion) REFERENCES Recomendacion(id_recomendacion)
);

GO


--  Progreso del alumno 
IF OBJECT_ID('Progreso_Alumno', 'U') IS NULL
CREATE TABLE Progreso_Alumno (
    id_progreso          INT            NOT NULL IDENTITY(1,1),
    id_usuario           INT            NOT NULL,           -- Usuario tipo 'alumno'
    promedio_ortografia  DECIMAL(5,2)       NULL,
    alineacion_score     DECIMAL(5,2)       NULL,
    tamano_letra_score   DECIMAL(5,2)       NULL,
    espaciado_score      DECIMAL(5,2)       NULL,
    inclinacion_score    DECIMAL(5,2)       NULL,
    fecha_modificacion   DATETIME2      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_Progreso_Alumno   PRIMARY KEY (id_progreso),
    CONSTRAINT UQ_Progreso_usuario  UNIQUE      (id_usuario),   
    CONSTRAINT FK_Progreso_usuario  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);


-- Análisis caligráfico 
IF OBJECT_ID('Analisis_Caligrafico', 'U') IS NULL
CREATE TABLE Analisis_Caligrafico (
    id_analisis_caligrafico INT            NOT NULL IDENTITY(1,1),
    id_intento              INT            NOT NULL,
    alineacion_score        DECIMAL(5,2)       NULL,
    tamano_letra_score      DECIMAL(5,2)       NULL,
    espaciado_score         DECIMAL(5,2)       NULL,
    inclinacion_score       DECIMAL(5,2)       NULL,
    observaciones           VARCHAR(MAX)       NULL,
    CONSTRAINT PK_Analisis_Caligrafico  PRIMARY KEY (id_analisis_caligrafico),
    CONSTRAINT UQ_Analisis_Cal_intento  UNIQUE      (id_intento),
    
    
    CONSTRAINT CK_alineacion_score CHECK (alineacion_score IS NULL
            OR (alineacion_score >= 0 AND alineacion_score <= 10)),
    CONSTRAINT CK_tamano_letra_score CHECK (tamano_letra_score IS NULL
            OR (tamano_letra_score >= 0 AND tamano_letra_score <= 10)),
    CONSTRAINT CK_espaciado_score CHECK (espaciado_score IS NULL
            OR (espaciado_score >= 0 AND espaciado_score <= 10)),
    CONSTRAINT CK_inclinacion_score CHECK (inclinacion_score IS NULL
            OR (inclinacion_score >= 0 AND inclinacion_score <= 10)),
    
    
    
    CONSTRAINT FK_Analisis_Cal_intento  FOREIGN KEY (id_intento) REFERENCES Intentos(id_intento)
);

--  Análisis ortográfico
IF OBJECT_ID('Analisis_Ortografico', 'U') IS NULL
CREATE TABLE Analisis_Ortografico (
    id_analisis_ortografico INT            NOT NULL IDENTITY(1,1),
    id_intento              INT            NOT NULL,     
    cantidad_errores        INT            NOT NULL DEFAULT 0,
    sugerencias_json        NVARCHAR(MAX)      NULL,       
    ortografia_score        DECIMAL(5,2)       NULL,
    CONSTRAINT PK_Analisis_Ortografico  PRIMARY KEY (id_analisis_ortografico),
    CONSTRAINT UQ_Analisis_Ort_intento  UNIQUE      (id_intento),
    CONSTRAINT FK_Analisis_Ort_intento  FOREIGN KEY (id_intento) REFERENCES Intentos(id_intento),

    CONSTRAINT CK_ortografia_score CHECK (ortografia_score IS NULL
            OR (ortografia_score >= 0 AND ortografia_score <= 10)),

    CONSTRAINT CK_sugerencias_json      CHECK (sugerencias_json IS NULL OR ISJSON(sugerencias_json) = 1)
);
GO

CREATE TABLE Sugerencia_Ortografica (
    id_sugerencia       INT           IDENTITY(1,1) NOT NULL,
    id_analisis_ortografico INT       NOT NULL,
    palabra_incorrecta  VARCHAR(100)  NOT NULL,
    posicion            INT           NULL,
    sugerencia          VARCHAR(100)  NOT NULL,
    contexto            VARCHAR(255)  NULL,
    CONSTRAINT PK_Sugerencia PRIMARY KEY (id_sugerencia),
    CONSTRAINT FK_Sugerencia_Analisis
        FOREIGN KEY (id_analisis_ortografico)
        REFERENCES Analisis_Ortografico(id_analisis_ortografico)
);
GO

-- Actividades sugeridas (catálogo) 
IF OBJECT_ID('Actividad_Sugerida', 'U') IS NULL
CREATE TABLE Actividad_Sugerida (
    id_actividad    INT           NOT NULL IDENTITY(1,1),
    tipo_error      VARCHAR(50)   NOT NULL,
    descripcion     VARCHAR(MAX)      NULL,
    tipo_ejercicio  VARCHAR(50)   NOT NULL,
    contenido       VARCHAR(MAX)  NOT NULL,
    id_estatus      INT           NOT NULL DEFAULT 1,
    CONSTRAINT PK_Actividad_Sugerida   PRIMARY KEY (id_actividad),
    CONSTRAINT FK_Actividad_Estatus     FOREIGN KEY (id_estatus) REFERENCES Estatus(id_estatus)
);


-- Recomendaciones 
IF OBJECT_ID('Recomendacion', 'U') IS NULL
CREATE TABLE Recomendacion (
    id_recomendacion  INT           NOT NULL IDENTITY(1,1),
    id_intento        INT           NOT NULL,
    id_actividad      INT           NOT NULL,
    fecha_generacion  DATETIME2     NOT NULL DEFAULT GETDATE(),
    estado            VARCHAR(15)   NOT NULL DEFAULT 'pendiente',
    prioridad         VARCHAR(15)       NULL,              
    CONSTRAINT PK_Recomendacion       PRIMARY KEY (id_recomendacion),
    CONSTRAINT FK_Recom_intento       FOREIGN KEY (id_intento)   REFERENCES Intentos(id_intento),
    CONSTRAINT FK_Recom_actividad     FOREIGN KEY (id_actividad) REFERENCES Actividad_Sugerida(id_actividad)
);


IF NOT EXISTS (SELECT 1 FROM Estatus)
BEGIN
    INSERT INTO Estatus (descripcion) VALUES 
    ('activo'), 
    ('inactivo'), 
    ('eliminado');
END
GO
