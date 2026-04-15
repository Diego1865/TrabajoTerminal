CREATE DATABASE TT;
GO

USE TT;
GO

-- ── Catálogo de estados ─────────────────────────────────────
IF OBJECT_ID('Estatus', 'U') IS NULL
CREATE TABLE Estatus (
    id_estatus   INT           NOT NULL IDENTITY(1,1),
    descripcion  VARCHAR(15)   NOT NULL,
    CONSTRAINT PK_Estatus PRIMARY KEY (id_estatus)
);

-- ── Usuario (tutores / administradores) ────────────────────
IF OBJECT_ID('Usuario', 'U') IS NULL
CREATE TABLE Usuario (
    id_usuario          INT           NOT NULL IDENTITY(1,1),
    nombre              VARCHAR(50)   NOT NULL,
    username            VARCHAR(75)   NOT NULL,
    correo              VARCHAR(100)  NOT NULL,
    contrasena_cifrada  VARCHAR(255)  NOT NULL,
    rol                 VARCHAR(30)   NOT NULL,
    fecha_registro      DATETIME2     NOT NULL DEFAULT GETDATE(),
    id_estatus          INT           NOT NULL DEFAULT 1,
    CONSTRAINT PK_Usuario        PRIMARY KEY (id_usuario),
    CONSTRAINT UQ_Usuario_correo UNIQUE      (correo),
    CONSTRAINT FK_Usuario_Estatus FOREIGN KEY (id_estatus) REFERENCES Estatus(id_estatus)
);

-- ── Alumnos ─────────────────────────────────────────────────
IF OBJECT_ID('Alumno', 'U') IS NULL
CREATE TABLE Alumno (
    id_alumno           INT           NOT NULL IDENTITY(1,1),
    nombre              VARCHAR(50)   NOT NULL,
    apellido_paterno    VARCHAR(50)   NOT NULL,
    apellido_materno    VARCHAR(50)       NULL,           
    usuario             VARCHAR(75)   NOT NULL,
    contrasena_cifrada  VARCHAR(255)  NOT NULL,
    grado               VARCHAR(15)   NOT NULL,
    grupo               VARCHAR(15)       NULL,
    fecha_registro      DATETIME2     NOT NULL DEFAULT GETDATE(),
    id_tutor            INT           NOT NULL,           
    id_estatus          INT           NOT NULL DEFAULT 1,
    CONSTRAINT PK_Alumno          PRIMARY KEY (id_alumno),
    CONSTRAINT UQ_Alumno_usuario  UNIQUE      (usuario),
    CONSTRAINT FK_Alumno_tutor    FOREIGN KEY (id_tutor)   REFERENCES Usuario(id_usuario),
    CONSTRAINT FK_Alumno_Estatus  FOREIGN KEY (id_estatus) REFERENCES Estatus(id_estatus)
);

-- ── Ejercicios ──────────────────────────────────────────────
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

-- ── Ejercicios_Tutor (Asignación de ejercicios a tutores) ──
IF OBJECT_ID('Ejercicios_Tutor', 'U') IS NULL
CREATE TABLE Ejercicios_Tutor (
    id_ejercicio_tutor  INT           NOT NULL IDENTITY(1,1),
    id_ejercicio        INT           NOT NULL,
    id_usuario          INT           NOT NULL,
    id_estatus          INT           NOT NULL DEFAULT 1,
    fecha_asignacion    DATETIME2     NOT NULL DEFAULT GETDATE(),
    fecha_desactivacion DATETIME2         NULL,
    CONSTRAINT PK_Ejercicios_Tutor PRIMARY KEY (id_ejercicio_tutor),
    CONSTRAINT FK_Ejercicios_Tutor_ejercicio FOREIGN KEY (id_ejercicio) REFERENCES Ejercicios(id_ejercicio),
    CONSTRAINT FK_Ejercicios_Tutor_usuario FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    CONSTRAINT FK_Ejercicios_Tutor_estatus FOREIGN KEY (id_estatus) REFERENCES Estatus(id_estatus)
);

-- ── Intentos ────────────────────────────────────────────────
IF OBJECT_ID('Intentos', 'U') IS NULL
CREATE TABLE Intentos (
    id_intento           INT         NOT NULL IDENTITY(1,1),
    id_alumno            INT         NOT NULL,
    id_ejercicio_tutor   INT         NOT NULL,
    imagen_codificada    VARCHAR(MAX) NOT NULL,            
    texto_detectado_ocr  VARCHAR(MAX)    NULL,           
    fecha_envio          DATETIME2   NOT NULL DEFAULT GETDATE(),
    tiempo_respuesta     INT             NULL,           
    CONSTRAINT PK_Intentos          PRIMARY KEY (id_intento),
    CONSTRAINT FK_Intentos_alumno   FOREIGN KEY (id_alumno)    REFERENCES Alumno(id_alumno),
    CONSTRAINT FK_Intentos_ET       FOREIGN KEY (id_ejercicio_tutor) REFERENCES Ejercicios_Tutor(id_ejercicio_tutor)
);

-- ── Progreso del alumno ─────────────────────────────────────
IF OBJECT_ID('Progreso_Alumno', 'U') IS NULL
CREATE TABLE Progreso_Alumno (
    id_progreso          INT            NOT NULL IDENTITY(1,1),
    id_alumno            INT            NOT NULL,
    promedio_ortografia  DECIMAL(5,2)       NULL,
    alineacion_score     DECIMAL(5,2)       NULL,
    tamano_letra_score   DECIMAL(5,2)       NULL,
    espaciado_score      DECIMAL(5,2)       NULL,
    inclinacion_score    DECIMAL(5,2)       NULL,
    fecha_modificacion   DATETIME2      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_Progreso_Alumno   PRIMARY KEY (id_progreso),
    CONSTRAINT UQ_Progreso_alumno   UNIQUE      (id_alumno),   
    CONSTRAINT FK_Progreso_alumno   FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno)
);

-- ── Historial del alumno ────────────────────────────────────
IF OBJECT_ID('Historial_Alumno', 'U') IS NULL
CREATE TABLE Historial_Alumno (
    id_historial         INT            NOT NULL IDENTITY(1,1),
    id_alumno            INT            NOT NULL,
    promedio_ortografia  DECIMAL(5,2)       NULL,
    alineacion_score     DECIMAL(5,2)       NULL,
    tamano_letra_score   DECIMAL(5,2)       NULL,
    espaciado_score      DECIMAL(5,2)       NULL,
    inclinacion_score    DECIMAL(5,2)       NULL,
    fecha                DATETIME2      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_Historial_Alumno PRIMARY KEY (id_historial),
    CONSTRAINT FK_Historial_alumno FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno)
);

-- ── Análisis caligráfico ────────────────────────────────────
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
    CONSTRAINT FK_Analisis_Cal_intento  FOREIGN KEY (id_intento) REFERENCES Intentos(id_intento)
);

-- ── Análisis ortográfico ────────────────────────────────────
IF OBJECT_ID('Analisis_Ortografico', 'U') IS NULL
CREATE TABLE Analisis_Ortografico (
    id_analisis_ortografico INT            NOT NULL IDENTITY(1,1),
    id_intento              INT            NOT NULL,
    errores_detectados      VARCHAR(MAX)       NULL,       
    cantidad_errores        INT            NOT NULL DEFAULT 0,
    sugerencias_json        NVARCHAR(MAX)      NULL,       
    ortografia_score        DECIMAL(5,2)       NULL,
    CONSTRAINT PK_Analisis_Ortografico  PRIMARY KEY (id_analisis_ortografico),
    CONSTRAINT UQ_Analisis_Ort_intento  UNIQUE      (id_intento),
    CONSTRAINT FK_Analisis_Ort_intento  FOREIGN KEY (id_intento) REFERENCES Intentos(id_intento),
    CONSTRAINT CK_sugerencias_json      CHECK (sugerencias_json IS NULL OR ISJSON(sugerencias_json) = 1)
);

-- ── Actividades sugeridas (catálogo) ────────────────────────
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

-- ── Recomendaciones ─────────────────────────────────────────
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

-- ── Inserciones Iniciales ───────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM Estatus)
BEGIN
    INSERT INTO Estatus (descripcion) VALUES 
    ('activo'), 
    ('inactivo'), 
    ('eliminado');
END
GO