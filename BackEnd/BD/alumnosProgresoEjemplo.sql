-- 1. Insertar alumnos de ejemplo separando Auth (Usuario) y Perfil (Alumno)
-- Se utiliza una tabla temporal para manejar la carga masiva y relacionar los IDs

CREATE TABLE #MockAlumnos (
    nombre VARCHAR(50), apellido_paterno VARCHAR(50), apellido_materno VARCHAR(50),
    username VARCHAR(75), contrasena_cifrada VARCHAR(255), 
    grado VARCHAR(15), grupo VARCHAR(15), id_tutor INT
);
CREATE TABLE #MockTutor (nombre VARCHAR(50), apellido_paterno VARCHAR(50),username VARCHAR(75), 
    contrasena_cifrada VARCHAR(255), correo VARCHAR(50));

INSERT INTO #MockTutor VALUES ('Diego','Barragán','diegob1','$2b$12$6aJuvv1Kt/qoBsDJev5.bekdZCd3xwm0N0Pv3RlHQZMkkP5ZwXGdW','correo@correo.com'),
('Ana','Martínez','anamart2','$2b$12$6aJuvv1Kt/qoBsDJev5.bekdZCd3xwm0N0Pv3RlHQZMkkP5ZwXGdW','correo2@correo.com'); 
INSERT INTO #MockAlumnos VALUES
('Juan', 'García', 'López', 'juangarc23', 'hashed_password_1', '3', 'A', 2),
('María', 'Rodríguez', 'Martínez', 'mariarod45', 'hashed_password_2', '3', 'A', 2),
('Carlos', 'Hernández', 'Pérez', 'carloshe78', 'hashed_password_3', '3', 'B', 2),
('Ana', 'López', 'González', 'analopez12', 'hashed_password_4', '4', 'A', 2),
('Luis', 'Martínez', 'Sánchez', 'luismart67', 'hashed_password_5', '4', 'B', 2),
('Sofia', 'Pérez', 'Ramírez', 'sofiape89', 'hashed_password_6', '4', 'A', 2),
('Diego', 'González', 'Torres', 'diegogon34', 'hashed_password_7', '3', 'C', 2),
('Laura', 'Fernández', 'Díaz', 'laurafe56', 'hashed_password_8', '3', 'A', 2),
('Miguel', 'Sánchez', 'Ruiz', 'miguelsa90', 'hashed_password_9', '4', 'B', 2),
('Isabel', 'Jiménez', 'Vargas', 'isabelji41', 'hashed_password_10', '3', 'A', 2),
('Roberto', 'Morales', 'Campos', 'robertomo28', 'hashed_password_11', '4', 'C', 2),
('Valentina', 'Romero', 'Navarro', 'valentinar73', 'hashed_password_12', '3', 'A', 2),
('Fernando', 'Castro', 'Ortiz', 'fernandoca55', 'hashed_password_13', '4', 'B', 2),
('Camila', 'Núñez', 'Flores', 'camilanu82', 'hashed_password_14', '3', 'A', 2),
('Pablo', 'Vargas', 'Medina', 'pablovar19', 'hashed_password_15', '4', 'C', 2),
('Gabriela', 'Aguilar', 'Salazar', 'gabrielag64', 'hashed_password_16', '3', 'B', 2),
('Andrés', 'Ibáñez', 'Reyes', 'andresib37', 'hashed_password_17', '4', 'B', 1),
('Mariana', 'Domínguez', 'Vega', 'marianadom51', 'hashed_password_18', '3', 'A', 1),
('Ricardo', 'Escobar', 'Montes', 'ricardoes72', 'hashed_password_19', '4', 'C', 1),
('Alejandra', 'Quintero', 'Acosta', 'alejandraq26', 'hashed_password_20', '3', 'A', 1),
('Francisco', 'Salinas', 'Bernal', 'franciscosal48', 'hashed_password_21', '4', 'B', 1),
('Daniela', 'Medrano', 'Gómez', 'danielamed93', 'hashed_password_22', '3', 'A', 1),
('Javier', 'Cortés', 'Lara', 'javiercor85', 'hashed_password_23', '4', 'C', 1),
('Natalia', 'Benavides', 'Hidalgo', 'nataliaben61', 'hashed_password_24', '3', 'A', 1),
('Eduardo', 'Molina', 'Ponce', 'eduardomol39', 'hashed_password_25', '4', 'B', 1),
('Lucía', 'Vázquez', 'Arias', 'luciavaz76', 'hashed_password_26', '3', 'A', 1),
('Mauricio', 'Riquelme', 'Carrillo', 'mauriciorit44', 'hashed_password_27', '4', 'C', 1),
('Catalina', 'Cifuentes', 'Durán', 'catalinacif88', 'hashed_password_28', '3', 'A', 1),
('Rodrigo', 'Valenzuela', 'Espinoza', 'rodrigoval57', 'hashed_password_29', '4', 'B', 1),
('Francisca', 'Tapia', 'Bravo', 'franciscatap70', 'hashed_password_30', '3', 'A', 1);

DECLARE @MapeoUsuarios TABLE (id_usuario INT, username VARCHAR(75));

-- Insertar en Usuario y obtener los IDs generados

INSERT INTO Usuario (nombre,apellido_paterno, username,contrasena_cifrada, tipo_usuario,id_estatus)
OUTPUT inserted.id_usuario, inserted.username INTO @MapeoUsuarios
SELECT nombre,apellido_paterno,username,contrasena_cifrada, 'tutor', 1 FROM #MockTutor;

INSERT INTO Usuario (nombre, apellido_paterno, username, contrasena_cifrada, tipo_usuario, id_estatus)
OUTPUT inserted.id_usuario, inserted.username INTO @MapeoUsuarios
SELECT nombre, apellido_paterno, username, contrasena_cifrada, 'alumno', 1
FROM #MockAlumnos;

INSERT INTO Tutor(id_usuario,correo)
SELECT mu.id_usuario,mo.correo FROM #MockTutor mo JOIN @MapeoUsuarios mu ON mo.username = mu.username; 

-- Insertar en Alumno utilizando el mapeo
INSERT INTO Alumno (id_usuario, id_tutor, apellido_materno, grado, grupo)
SELECT mu.id_usuario, ma.id_tutor, ma.apellido_materno, ma.grado, ma.grupo
FROM #MockAlumnos ma
JOIN @MapeoUsuarios mu ON ma.username = mu.username;

DROP TABLE #MockTutor;
DROP TABLE #MockAlumnos;

-- El progreso ya no se inserta a mano: es la vista vw_Progreso_Alumno
-- (migraciones/004_progreso_vista.sql) y sale de los intentos que califica el tutor.
