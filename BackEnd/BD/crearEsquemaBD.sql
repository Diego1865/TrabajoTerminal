
-- ── Catálogo de estados ─────────────────────────────────────
CREATE TABLE status (
    id_estatus   INT           NOT NULL IDENTITY(1,1),
    descripcion  VARCHAR(15)   NOT NULL,
    CONSTRAINT PK_status PRIMARY KEY (id_estatus)
);

-- ── Usuarios (tutores / administradores) ────────────────────
CREATE TABLE Usuarios (
    id_usuario          INT           NOT NULL IDENTITY(1,1),
    nombre              VARCHAR(50)   NOT NULL,
    correo              VARCHAR(100)  NOT NULL,
    contrasena_cifrada  VARCHAR(255)  NOT NULL,
    rol                 VARCHAR(30)   NOT NULL,
    fecha_registro      DATETIME2     NOT NULL DEFAULT GETDATE(),
    id_estatus          INT           NOT NULL DEFAULT 1,
    CONSTRAINT PK_Usuarios        PRIMARY KEY (id_usuario),
    CONSTRAINT UQ_Usuarios_correo UNIQUE      (correo),
    CONSTRAINT FK_Usuarios_status FOREIGN KEY (id_estatus) REFERENCES status(id_estatus)
);

-- ── Alumnos ─────────────────────────────────────────────────
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
    CONSTRAINT FK_Alumno_tutor    FOREIGN KEY (id_tutor)   REFERENCES Usuarios(id_usuario),
    CONSTRAINT FK_Alumno_status   FOREIGN KEY (id_estatus) REFERENCES status(id_estatus)
);

-- ── Ejercicios ──────────────────────────────────────────────
CREATE TABLE Ejercicios (
    id_ejercicio     INT           NOT NULL IDENTITY(1,1),
    titulo           VARCHAR(150)  NOT NULL,
    descripcion      VARCHAR(MAX)  NOT NULL,              
    tipo             VARCHAR(30)   NOT NULL,
  --  nivel_dificultad INT           NOT NULL DEFAULT 1,
    contenido_base   VARCHAR(MAX)  NOT NULL,
    id_estatus       INT           NOT NULL DEFAULT 1,
    CONSTRAINT PK_Ejercicios        PRIMARY KEY (id_ejercicio),
    CONSTRAINT FK_Ejercicios_status FOREIGN KEY (id_estatus) REFERENCES status(id_estatus)
);

-- ── Intentos ────────────────────────────────────────────────
CREATE TABLE Intentos (
    id_intento           INT         NOT NULL IDENTITY(1,1),
    id_alumno            INT         NOT NULL,
    id_ejercicio         INT         NOT NULL,
    imagen_codificada    VARCHAR(MAX) NOT NULL,            
    texto_detectado_ocr  VARCHAR(MAX)    NULL,           
    fecha_envio          DATETIME2   NOT NULL DEFAULT GETDATE(),
    tiempo_respuesta     INT             NULL,           
    CONSTRAINT PK_Intentos          PRIMARY KEY (id_intento),
    CONSTRAINT FK_Intentos_alumno   FOREIGN KEY (id_alumno)    REFERENCES Alumno(id_alumno),
    CONSTRAINT FK_Intentos_ejercicio FOREIGN KEY (id_ejercicio) REFERENCES Ejercicios(id_ejercicio)
);

-- ── Progreso del alumno  ───────────────────
CREATE TABLE Progreso_Alumno (
    id_progreso          INT            NOT NULL IDENTITY(1,1),
    id_alumno            INT            NOT NULL,
    promedio_ortografia  DECIMAL(5,2)       NULL,
    aliniacion_score     DECIMAL(5,2)       NULL,
    tamano_letra_score   DECIMAL(5,2)       NULL,
    espaciado_score      DECIMAL(5,2)       NULL,
    inclinacion_score    DECIMAL(5,2)       NULL,
    fecha_modificacion   DATETIME2      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_Progreso_Alumno   PRIMARY KEY (id_progreso),
    CONSTRAINT UQ_Progreso_alumno   UNIQUE      (id_alumno),   -- un registro por alumno
    CONSTRAINT FK_Progreso_alumno   FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno)
);

-- ── Historial del alumno  ───────────────────
CREATE TABLE Historial_Alumno (
    id_historial         INT            NOT NULL IDENTITY(1,1),
    id_alumno            INT            NOT NULL,
    promedio_ortografia  DECIMAL(5,2)       NULL,
    aliniacion_score     DECIMAL(5,2)       NULL,
    tamano_letra_score   DECIMAL(5,2)       NULL,
    espaciado_score      DECIMAL(5,2)       NULL,
    inclinacion_score    DECIMAL(5,2)       NULL,
    fecha                DATETIME2      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT PK_Historial_Alumno PRIMARY KEY (id_historial),
    CONSTRAINT FK_Historial_alumno FOREIGN KEY (id_alumno) REFERENCES Alumno(id_alumno)
);

-- ── Análisis caligráfico ────────────────────────────────────
CREATE TABLE Analisis_Caligrafico (
    id_analisis_caligrafico INT            NOT NULL IDENTITY(1,1),
    id_intento              INT            NOT NULL,
    aliniacion_score        DECIMAL(5,2)       NULL,
    tamano_letra_score      DECIMAL(5,2)       NULL,
    espaciado_score         DECIMAL(5,2)       NULL,
    inclinacion_score       DECIMAL(5,2)       NULL,
    observaciones           VARCHAR(MAX)       NULL,
    CONSTRAINT PK_Analisis_Caligrafico  PRIMARY KEY (id_analisis_caligrafico),
    CONSTRAINT UQ_Analisis_Cal_intento  UNIQUE      (id_intento),  -- uno por intento
    CONSTRAINT FK_Analisis_Cal_intento  FOREIGN KEY (id_intento) REFERENCES Intentos(id_intento)
);

-- ── Análisis ortográfico ────────────────────────────────────
CREATE TABLE Analisis_Ortografico (
    id_analisis_ortografico INT            NOT NULL IDENTITY(1,1),
    id_intento              INT            NOT NULL,
    errores_detectados      VARCHAR(MAX)       NULL,       -- puede no haber errores
    cantidad_errores        INT            NOT NULL DEFAULT 0,
    sugerencias_json        NVARCHAR(MAX)      NULL,       
    ortografia_score        DECIMAL(5,2)       NULL,
    CONSTRAINT PK_Analisis_Ortografico  PRIMARY KEY (id_analisis_ortografico),
    CONSTRAINT UQ_Analisis_Ort_intento  UNIQUE      (id_intento),
    CONSTRAINT FK_Analisis_Ort_intento  FOREIGN KEY (id_intento) REFERENCES Intentos(id_intento),
    CONSTRAINT CK_sugerencias_json      CHECK (sugerencias_json IS NULL OR ISJSON(sugerencias_json) = 1)
);

-- ── Actividades sugeridas (catálogo) ────────────────────────
CREATE TABLE Actividad_Sugerida (
    id_actividad    INT           NOT NULL IDENTITY(1,1),
    tipo_error      VARCHAR(50)   NOT NULL,
    descripcion     VARCHAR(MAX)      NULL,
    tipo_ejercicio  VARCHAR(50)   NOT NULL,
    contenido       VARCHAR(MAX)  NOT NULL,
    id_estatus      INT           NOT NULL DEFAULT 1,
    CONSTRAINT PK_Actividad_Sugerida   PRIMARY KEY (id_actividad),
    CONSTRAINT FK_Actividad_status     FOREIGN KEY (id_estatus) REFERENCES status(id_estatus)
);

-- ── Recomendaciones ─────────────────────────────────────────
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

INSERT INTO status (descripcion) VALUES 
('activo'), 
('inactivo'), 
('eliminado');