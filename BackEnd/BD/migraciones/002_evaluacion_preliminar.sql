-- Configurar referencias explícitas del catálogo conocido. No modifica intentos ni notas.
-- Ejecutar en la base de la aplicación. Puede repetirse sin reemplazar configuraciones propias.
SET XACT_ABORT ON;
BEGIN TRANSACTION;
DECLARE @referencias TABLE (guia NVARCHAR(1000), modo NVARCHAR(20), respuesta NVARCHAR(1000));
INSERT INTO @referencias VALUES
(N'a e i o u', N'copia', N'a e i o u'),
(N'El burro valiente busca un barco viejo.', N'copia', N'El burro valiente busca un barco viejo.'),
(N'La rápida zorra marrón salta sobre el perro perezoso.', N'copia', N'La rápida zorra marrón salta sobre el perro perezoso.'),
(N'El _apatero hace _apato_ con _inta_ de _eda.', N'completar', N'El zapatero hace zapatos con cintas de seda.'),
(N'El pajaro canto en el arbol.', N'completar', N'El pájaro cantó en el árbol.'),
(N'El gigante juega con un girasol en el jardín.', N'copia', N'El gigante juega con un girasol en el jardín.'),
(N'Aquel zorro pequeño corría feliz por el bosque verde.', N'copia', N'Aquel zorro pequeño corría feliz por el bosque verde.');
UPDATE e SET contenido_base = JSON_MODIFY(e.contenido_base, '$.evaluacion',
    JSON_QUERY(N'{"modo":"' + r.modo + N'","respuestas_aceptadas":["' + STRING_ESCAPE(r.respuesta, 'json') + N'"]}'))
FROM dbo.Ejercicios e JOIN @referencias r
    ON JSON_VALUE(CASE WHEN ISJSON(e.contenido_base)=1 THEN e.contenido_base ELSE N'{}' END, '$.texto_guia') COLLATE Latin1_General_100_BIN2 = r.guia COLLATE Latin1_General_100_BIN2
WHERE ISJSON(e.contenido_base)=1
  AND JSON_QUERY(e.contenido_base, '$.evaluacion') IS NULL;
COMMIT TRANSACTION;
