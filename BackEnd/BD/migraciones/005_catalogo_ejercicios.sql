-- GENERADO por BD/catalogo/generar_migracion.py a partir de catalogo_ejercicios.json; no editar a mano.
-- Catálogo de ejercicios por método (sintético, analítico, ecléctico) y error ortográfico común.
-- Reemplaza el catálogo de ejemplo: se desactiva (no se borra, hay intentos que lo referencian)
-- y se cierran sus asignaciones activas para que los alumnos dejen de verlo.
USE TT;
GO

DECLARE @nuevos TABLE (titulo VARCHAR(150) PRIMARY KEY);
INSERT INTO @nuevos (titulo) VALUES
    ('Vocales en su renglón'),
    ('Letras redondas'),
    ('Letras con palito: b d p q'),
    ('Sílabas con m y p'),
    ('Junta las sílabas'),
    ('Separa en sílabas'),
    ('Sílabas trabadas: escribe lo que ves'),
    ('La letra escondida'),
    ('¿B o V? Escribe lo que ves'),
    ('Completa con b o v'),
    ('La vaca bebe agua'),
    ('¿C, S o Z? Escribe lo que ves'),
    ('Completa con c, s o z'),
    ('¿C, K o QU? Escribe lo que ves'),
    ('Completa con c o qu'),
    ('El conejo come queso'),
    ('¿B o D? Mira bien'),
    ('Sin voltear la p y la q'),
    ('Copia la rayita'),
    ('¿Dónde va la tilde?'),
    ('Ponle tilde'),
    ('Espacio entre palabras'),
    ('La oración del día'),
    ('Mi oración completa');

UPDATE et SET et.id_estatus = 2, et.fecha_desactivacion = GETDATE()
FROM dbo.Ejercicios_Tutor et JOIN dbo.Ejercicios e ON e.id_ejercicio = et.id_ejercicio
WHERE et.id_estatus = 1 AND e.id_tutor_creador IS NULL AND e.tipo <> 'dictado'
  AND e.titulo NOT IN (SELECT titulo FROM @nuevos);

UPDATE dbo.Ejercicios SET id_estatus = 2
WHERE id_estatus = 1 AND id_tutor_creador IS NULL AND tipo <> 'dictado'
  AND titulo NOT IN (SELECT titulo FROM @nuevos);
GO

-- 1. Vocales en su renglón
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Vocales en su renglón' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Vocales en su renglón',
    'Escribe las cinco vocales. Que todas toquen la línea de abajo y tengan el mismo tamaño.',
    'Legibilidad',
    '{"texto_guia":"a e i o u","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["a e i o u"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"trazo","nivel":1,"habilidad":"Tamaño y alineación del trazo","estrategia":"Copia de modelo","pista":"Empieza cada vocal arriba y bájala hasta tocar la línea.","orden":1}}',
    1);

-- 2. Letras redondas
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Letras redondas' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Letras redondas',
    'Escribe estas letras redondas. Todas empiezan con la misma bolita y giran hacia el mismo lado.',
    'Legibilidad',
    '{"texto_guia":"a c d g q","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["a c d g q"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"trazo","nivel":1,"habilidad":"Direccionalidad del trazo","estrategia":"Trazos de direccionalidad","pista":"La bolita se hace como la letra c: empieza arriba y gira hacia la izquierda.","orden":2}}',
    1);

-- 3. Letras con palito: b d p q
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Letras con palito: b d p q' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Letras con palito: b d p q',
    'Escribe estas cuatro letras con cuidado. Se parecen, pero cada una mira hacia un lado distinto.',
    'Legibilidad',
    '{"texto_guia":"b d p q","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["b d p q"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"inversion","nivel":1,"habilidad":"Orientación espacial de la letra","estrategia":"Discriminación visual","pista":"La b y la p tienen la panza a la derecha; la d y la q, a la izquierda.","orden":3}}',
    1);

-- 4. Sílabas con m y p
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Sílabas con m y p' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Sílabas con m y p',
    'Escribe las sílabas con m y con p. Separa cada sílaba con un espacio.',
    'Ortografía',
    '{"texto_guia":"ma me mi mo mu pa pe pi po pu","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["ma me mi mo mu pa pe pi po pu"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"omision_adicion","nivel":1,"habilidad":"Procesamiento fonológico","estrategia":"Conciencia silábica","pista":"Di cada sílaba en voz alta mientras la escribes: ma, me, mi…","orden":4}}',
    1);

-- 5. Junta las sílabas
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Junta las sílabas' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Junta las sílabas',
    'Une las sílabas para formar palabras y escribe solo las palabras.',
    'Ortografía',
    '{"texto_guia":"lu + na     me + sa     pe + lo + ta","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["luna mesa pelota"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"omision_adicion","nivel":1,"habilidad":"Procesamiento fonológico","estrategia":"Conciencia silábica","pista":"Lee las sílabas juntas y rápido: lu-na, luna.","orden":5}}',
    1);

-- 6. Separa en sílabas
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Separa en sílabas' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Separa en sílabas',
    'Escribe cada palabra separada en sílabas, con un espacio entre sílaba y sílaba.',
    'Ortografía',
    '{"texto_guia":"mariposa     zapato","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["ma ri po sa za pa to","ma-ri-po-sa za-pa-to"]},"pedagogia":{"metodo":"analitico","error_objetivo":"omision_adicion","nivel":2,"habilidad":"Procesamiento fonológico","estrategia":"Conciencia silábica","pista":"Da un aplauso por cada sílaba: ma-ri-po-sa son cuatro aplausos.","orden":6}}',
    1);

-- 7. Sílabas trabadas: escribe lo que ves
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Sílabas trabadas: escribe lo que ves' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Sílabas trabadas: escribe lo que ves',
    'Mira los dibujos y escribe el nombre de cada uno, en orden del 1 al 4.',
    'Ortografía',
    '{"texto_guia":null,"imagen_guia":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgNTIwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjx0ZXh0IHg9IjY1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+Nve+4jzwvdGV4dD48dGV4dCB4PSI2NSIgeT0iMTM4IiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkQyOEQ5Ij4xPC90ZXh0Pjx0ZXh0IHg9IjE5NSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfjLg8L3RleHQ+PHRleHQgeD0iMTk1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2RDI4RDkiPjI8L3RleHQ+PHRleHQgeD0iMzI1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+OiDwvdGV4dD48dGV4dCB4PSIzMjUiIHk9IjEzOCIgZm9udC1zaXplPSIyOCIgZm9udC13ZWlnaHQ9IjcwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZEMjhEOSI+MzwvdGV4dD48dGV4dCB4PSI0NTUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5qCPC90ZXh0Pjx0ZXh0IHg9IjQ1NSIgeT0iMTM4IiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkQyOEQ5Ij40PC90ZXh0Pjwvc3ZnPg==","imagen_en_lienzo":false,"evaluacion":{"modo":"imagen","respuestas_aceptadas":["plato flor globo tren"]},"pedagogia":{"metodo":"analitico","error_objetivo":"omision_adicion","nivel":2,"habilidad":"Procesamiento fonológico","estrategia":"Conciencia silábica","pista":"Estas palabras tienen dos consonantes juntas, como pl, fl, gl y tr. ¡No te comas ninguna!","orden":7}}',
    1);

-- 8. La letra escondida
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La letra escondida' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La letra escondida',
    'A cada palabra le falta una letra. Escribe las palabras completas.',
    'Ortografía',
    '{"texto_guia":"p_ato     f_or     g_obo     t_en","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["plato flor globo tren"]},"pedagogia":{"metodo":"eclectico","error_objetivo":"omision_adicion","nivel":3,"habilidad":"Procesamiento fonológico","estrategia":"Conciencia silábica","pista":"Di la palabra despacio y escucha qué sonido falta.","orden":8}}',
    1);

-- 9. ¿B o V? Escribe lo que ves
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = '¿B o V? Escribe lo que ves' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    '¿B o V? Escribe lo que ves',
    'Mira los dibujos y escribe el nombre de cada uno, en orden del 1 al 4.',
    'Ortografía',
    '{"texto_guia":null,"imagen_guia":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgNTIwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjx0ZXh0IHg9IjY1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+QhDwvdGV4dD48dGV4dCB4PSI2NSIgeT0iMTM4IiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkQyOEQ5Ij4xPC90ZXh0Pjx0ZXh0IHg9IjE5NSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfjYc8L3RleHQ+PHRleHQgeD0iMTk1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2RDI4RDkiPjI8L3RleHQ+PHRleHQgeD0iMzI1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+RojwvdGV4dD48dGV4dCB4PSIzMjUiIHk9IjEzOCIgZm9udC1zaXplPSIyOCIgZm9udC13ZWlnaHQ9IjcwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZEMjhEOSI+MzwvdGV4dD48dGV4dCB4PSI0NTUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7imIHvuI88L3RleHQ+PHRleHQgeD0iNDU1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2RDI4RDkiPjQ8L3RleHQ+PC9zdmc+","imagen_en_lienzo":false,"evaluacion":{"modo":"imagen","respuestas_aceptadas":["vaca uvas bota nube","vaca uva bota nube"]},"pedagogia":{"metodo":"analitico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Conciencia ortográfica","estrategia":"Dictado lúdico con imágenes","pista":"Suenan igual, así que recuerda cómo se ven escritas: vaca con v, bota con b.","orden":9}}',
    1);

-- 10. Completa con b o v
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Completa con b o v' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Completa con b o v',
    'Escribe las palabras completas, poniendo b o v donde está la rayita.',
    'Ortografía',
    '{"texto_guia":"_aca     nu_e     _ota     _ela","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["vaca nube bota vela"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Conciencia ortográfica","estrategia":"Dictado lúdico con imágenes","pista":"Piensa en el dibujo de cada palabra y en cómo la has visto escrita.","orden":10}}',
    1);

-- 11. La vaca bebe agua
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La vaca bebe agua' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La vaca bebe agua',
    'Escribe la oración completa, poniendo b o v donde está la rayita.',
    'Ortografía',
    '{"texto_guia":"La _aca _e_e agua.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["La vaca bebe agua."]},"pedagogia":{"metodo":"eclectico","error_objetivo":"grafias_dudosas","nivel":3,"habilidad":"Conciencia ortográfica","estrategia":"Dictado lúdico con imágenes","pista":"Empieza con mayúscula y termina con punto.","orden":11}}',
    1);

-- 12. ¿C, S o Z? Escribe lo que ves
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = '¿C, S o Z? Escribe lo que ves' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    '¿C, S o Z? Escribe lo que ves',
    'Mira los dibujos y escribe el nombre de cada uno, en orden del 1 al 4.',
    'Ortografía',
    '{"texto_guia":null,"imagen_guia":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgNTIwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjx0ZXh0IHg9IjY1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+RnjwvdGV4dD48dGV4dCB4PSI2NSIgeT0iMTM4IiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkQyOEQ5Ij4xPC90ZXh0Pjx0ZXh0IHg9IjE5NSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfj6A8L3RleHQ+PHRleHQgeD0iMTk1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2RDI4RDkiPjI8L3RleHQ+PHRleHQgeD0iMzI1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+NsjwvdGV4dD48dGV4dCB4PSIzMjUiIHk9IjEzOCIgZm9udC1zaXplPSIyOCIgZm9udC13ZWlnaHQ9IjcwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZEMjhEOSI+MzwvdGV4dD48dGV4dCB4PSI0NTUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5C7PC90ZXh0Pjx0ZXh0IHg9IjQ1NSIgeT0iMTM4IiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkQyOEQ5Ij40PC90ZXh0Pjwvc3ZnPg==","imagen_en_lienzo":false,"evaluacion":{"modo":"imagen","respuestas_aceptadas":["zapato casa sopa oso"]},"pedagogia":{"metodo":"analitico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Conciencia ortográfica","estrategia":"Dictado lúdico con imágenes","pista":"Una de estas palabras empieza con z.","orden":12}}',
    1);

-- 13. Completa con c, s o z
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Completa con c, s o z' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Completa con c, s o z',
    'Escribe las palabras completas, poniendo c, s o z donde está la rayita.',
    'Ortografía',
    '{"texto_guia":"_apato     _ielo     _opa     ta_a","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["zapato cielo sopa taza"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Conciencia ortográfica","estrategia":"Dictado lúdico con imágenes","pista":"Con e y con i usamos la c suave: ce, ci.","orden":13}}',
    1);

-- 14. ¿C, K o QU? Escribe lo que ves
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = '¿C, K o QU? Escribe lo que ves' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    '¿C, K o QU? Escribe lo que ves',
    'Mira los dibujos y escribe el nombre de cada uno, en orden del 1 al 4.',
    'Ortografía',
    '{"texto_guia":null,"imagen_guia":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgNTIwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjx0ZXh0IHg9IjY1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+ngDwvdGV4dD48dGV4dCB4PSI2NSIgeT0iMTM4IiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkQyOEQ5Ij4xPC90ZXh0Pjx0ZXh0IHg9IjE5NSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfpZ08L3RleHQ+PHRleHQgeD0iMTk1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2RDI4RDkiPjI8L3RleHQ+PHRleHQgeD0iMzI1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+QsDwvdGV4dD48dGV4dCB4PSIzMjUiIHk9IjEzOCIgZm9udC1zaXplPSIyOCIgZm9udC13ZWlnaHQ9IjcwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZEMjhEOSI+MzwvdGV4dD48dGV4dCB4PSI0NTUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn6WEPC90ZXh0Pjx0ZXh0IHg9IjQ1NSIgeT0iMTM4IiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkQyOEQ5Ij40PC90ZXh0Pjwvc3ZnPg==","imagen_en_lienzo":false,"evaluacion":{"modo":"imagen","respuestas_aceptadas":["queso kiwi conejo cuchara"]},"pedagogia":{"metodo":"analitico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Conciencia ortográfica","estrategia":"Dictado lúdico con imágenes","pista":"Para decir que y qui se escribe qu.","orden":14}}',
    1);

-- 15. Completa con c o qu
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Completa con c o qu' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Completa con c o qu',
    'Escribe las palabras completas, poniendo c o qu donde está la rayita.',
    'Ortografía',
    '{"texto_guia":"_eso     _una     pa_ete     _ama","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["queso cuna paquete cama"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Conciencia ortográfica","estrategia":"Dictado lúdico con imágenes","pista":"ca, co, cu con c; que, qui con qu.","orden":15}}',
    1);

-- 16. El conejo come queso
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'El conejo come queso' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'El conejo come queso',
    'Copia la oración. Fíjate en las palabras con c, qu y s.',
    'Ortografía',
    '{"texto_guia":"El conejo come queso en su casa.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["El conejo come queso en su casa."]},"pedagogia":{"metodo":"eclectico","error_objetivo":"grafias_dudosas","nivel":3,"habilidad":"Conciencia ortográfica","estrategia":"Dictado lúdico con imágenes","pista":"Lee la oración completa antes de escribirla.","orden":16}}',
    1);

-- 17. ¿B o D? Mira bien
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = '¿B o D? Mira bien' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    '¿B o D? Mira bien',
    'Mira los dibujos y escribe el nombre de cada uno, en orden del 1 al 4.',
    'Ortografía',
    '{"texto_guia":null,"imagen_guia":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgNTIwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjx0ZXh0IHg9IjY1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+OsjwvdGV4dD48dGV4dCB4PSI2NSIgeT0iMTM4IiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkQyOEQ5Ij4xPC90ZXh0Pjx0ZXh0IHg9IjE5NSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfkbY8L3RleHQ+PHRleHQgeD0iMTk1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2RDI4RDkiPjI8L3RleHQ+PHRleHQgeD0iMzI1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pid77iPPC90ZXh0Pjx0ZXh0IHg9IjMyNSIgeT0iMTM4IiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkQyOEQ5Ij4zPC90ZXh0Pjx0ZXh0IHg9IjQ1NSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfkYQ8L3RleHQ+PHRleHQgeD0iNDU1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2RDI4RDkiPjQ8L3RleHQ+PC9zdmc+","imagen_en_lienzo":false,"evaluacion":{"modo":"imagen","respuestas_aceptadas":["dado bebé dedo boca"]},"pedagogia":{"metodo":"analitico","error_objetivo":"inversion","nivel":2,"habilidad":"Orientación espacial de la letra","estrategia":"Discriminación visual","pista":"La b tiene la panza a la derecha y la d, a la izquierda.","orden":17}}',
    1);

-- 18. Sin voltear la p y la q
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Sin voltear la p y la q' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Sin voltear la p y la q',
    'Copia la oración sin voltear la p ni la q.',
    'Ortografía',
    '{"texto_guia":"El papá pequeño come queso.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["El papá pequeño come queso."]},"pedagogia":{"metodo":"eclectico","error_objetivo":"inversion","nivel":3,"habilidad":"Orientación espacial de la letra","estrategia":"Discriminación visual","pista":"La p tiene la panza a la derecha y la q, a la izquierda.","orden":18}}',
    1);

-- 19. Copia la rayita
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Copia la rayita' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Copia la rayita',
    'Copia las palabras. No olvides la rayita (tilde) sobre la última vocal.',
    'Ortografía',
    '{"texto_guia":"papá mamá café sofá","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["papá mamá café sofá"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"tildes","nivel":1,"habilidad":"Identificación de la sílaba tónica y uso de la tilde","estrategia":"Desafíos visuales","pista":"Di la palabra en voz alta: la parte que suena más fuerte lleva la rayita.","orden":19}}',
    1);

-- 20. ¿Dónde va la tilde?
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = '¿Dónde va la tilde?' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    '¿Dónde va la tilde?',
    'Mira los dibujos y escribe el nombre de cada uno, en orden del 1 al 4. Todos llevan tilde.',
    'Ortografía',
    '{"texto_guia":null,"imagen_guia":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgNTIwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjx0ZXh0IHg9IjY1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+QrTwvdGV4dD48dGV4dCB4PSI2NSIgeT0iMTM4IiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkQyOEQ5Ij4xPC90ZXh0Pjx0ZXh0IHg9IjE5NSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfjYs8L3RleHQ+PHRleHQgeD0iMTk1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2RDI4RDkiPjI8L3RleHQ+PHRleHQgeD0iMzI1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pyI77iPPC90ZXh0Pjx0ZXh0IHg9IjMyNSIgeT0iMTM4IiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkQyOEQ5Ij4zPC90ZXh0Pjx0ZXh0IHg9IjQ1NSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfmpo8L3RleHQ+PHRleHQgeD0iNDU1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2RDI4RDkiPjQ8L3RleHQ+PC9zdmc+","imagen_en_lienzo":false,"evaluacion":{"modo":"imagen","respuestas_aceptadas":["ratón limón avión camión"]},"pedagogia":{"metodo":"analitico","error_objetivo":"tildes","nivel":2,"habilidad":"Identificación de la sílaba tónica y uso de la tilde","estrategia":"Desafíos visuales","pista":"Todas terminan igual: la rayita va sobre la o.","orden":20}}',
    1);

-- 21. Ponle tilde
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Ponle tilde' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Ponle tilde',
    'A esta oración le faltan las tildes. Escríbela completa con sus tildes.',
    'Ortografía',
    '{"texto_guia":"El raton come limon en el sofa.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["El ratón come limón en el sofá."]},"pedagogia":{"metodo":"eclectico","error_objetivo":"tildes","nivel":3,"habilidad":"Identificación de la sílaba tónica y uso de la tilde","estrategia":"Desafíos visuales","pista":"Faltan tres tildes.","orden":21}}',
    1);

-- 22. Espacio entre palabras
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Espacio entre palabras' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Espacio entre palabras',
    'Copia la oración. Deja el espacio de un dedo entre cada palabra.',
    'Legibilidad',
    '{"texto_guia":"Mi mamá me ama.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["Mi mamá me ama."]},"pedagogia":{"metodo":"analitico","error_objetivo":"trazo","nivel":2,"habilidad":"Espaciado entre palabras","estrategia":"Copia de modelo","pista":"Pon tu dedo después de cada palabra antes de escribir la siguiente.","orden":22}}',
    1);

-- 23. La oración del día
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La oración del día' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La oración del día',
    'Copia la oración sobre el renglón, con todas las letras derechitas.',
    'Legibilidad',
    '{"texto_guia":"El sol sale por la mañana.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["El sol sale por la mañana."]},"pedagogia":{"metodo":"analitico","error_objetivo":"trazo","nivel":2,"habilidad":"Alineación e inclinación del trazo","estrategia":"Copia de modelo","pista":"Todas las letras se apoyan en la línea, como si estuvieran sentadas.","orden":23}}',
    1);

-- 24. Mi oración completa
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Mi oración completa' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Mi oración completa',
    'Copia la oración con tu mejor letra: mayúscula al inicio, espacios entre palabras y punto al final.',
    'Ortografía',
    '{"texto_guia":"Mi papá ve un globo azul.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["Mi papá ve un globo azul."]},"pedagogia":{"metodo":"eclectico","error_objetivo":"integracion","nivel":3,"habilidad":"Integración de ortografía y trazo","estrategia":"Copia de modelo","pista":"Revisa la v, la b, la z y la tilde de papá antes de entregar.","orden":24}}',
    1);
GO
