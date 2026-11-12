-- GENERADO por BD/catalogo/generar_migracion.py a partir de catalogo_ejercicios.json; no editar a mano.
-- Ampliación del catálogo (lote 2): solo inserta ejercicios nuevos, no desactiva los existentes.
-- Los tutores deben activarlos para que sus alumnos los vean.
USE TT;
GO

-- 25. Letra h en su renglón
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Letra h en su renglón' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Letra h en su renglón',
    'Escribe tres h minúsculas y tres H mayúsculas. El palito de la h sube alto y la panza toca la línea de abajo.',
    'Legibilidad',
    '{"texto_guia":"h h h H H H","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["h h h H H H"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"trazo","nivel":1,"habilidad":"Tamaño y alineación del trazo","estrategia":"Copia de modelo","pista":"La h empieza con un palito alto y después hace un puentecito.","orden":25}}',
    1);

-- 26. Sílabas con h
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Sílabas con h' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Sílabas con h',
    'Escribe las sílabas con h. Separa cada sílaba con un espacio.',
    'Ortografía',
    '{"texto_guia":"ha he hi ho hu","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["ha he hi ho hu"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Conciencia ortográfica","estrategia":"Copia de modelo","pista":"La h es una letra calladita: se escribe, pero no suena.","orden":26}}',
    1);

-- 27. La h no suena
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La h no suena' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La h no suena',
    'Copia estas palabras. Todas empiezan con una h que no suena.',
    'Ortografía',
    '{"texto_guia":"hola hoy hijo hermano","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["hola hoy hijo hermano"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Conciencia ortográfica","estrategia":"Copia de modelo","pista":"Aunque digas «ola», hola se escribe con h al principio.","orden":27}}',
    1);

-- 28. Agrega la h que no suena
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Agrega la h que no suena' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Agrega la h que no suena',
    'A cada palabra le falta la h. Escribe las palabras completas.',
    'Ortografía',
    '{"texto_guia":"_ilo     _umo     _acha     _orno","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["hilo humo hacha horno"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Conciencia ortográfica","estrategia":"Completar palabras","pista":"Todas empiezan con la letra calladita.","orden":28}}',
    1);

-- 29. ¿Lleva h? Escribe lo que ves
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = '¿Lleva h? Escribe lo que ves' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    '¿Lleva h? Escribe lo que ves',
    'Mira los dibujos y escribe el nombre de cada uno, en orden del 1 al 4. Todos empiezan con h.',
    'Ortografía',
    '{"texto_guia":null,"imagen_guia":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgNTIwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjx0ZXh0IHg9IjY1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+lmjwvdGV4dD48dGV4dCB4PSI2NSIgeT0iMTM4IiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkQyOEQ5Ij4xPC90ZXh0Pjx0ZXh0IHg9IjE5NSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfjaY8L3RleHQ+PHRleHQgeD0iMTk1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2RDI4RDkiPjI8L3RleHQ+PHRleHQgeD0iMzI1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+NgzwvdGV4dD48dGV4dCB4PSIzMjUiIHk9IjEzOCIgZm9udC1zaXplPSIyOCIgZm9udC13ZWlnaHQ9IjcwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZEMjhEOSI+MzwvdGV4dD48dGV4dCB4PSI0NTUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5CcPC90ZXh0Pjx0ZXh0IHg9IjQ1NSIgeT0iMTM4IiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkQyOEQ5Ij40PC90ZXh0Pjwvc3ZnPg==","imagen_en_lienzo":false,"evaluacion":{"modo":"imagen","respuestas_aceptadas":["huevo helado hoja hormiga"]},"pedagogia":{"metodo":"analitico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Conciencia ortográfica","estrategia":"Dictado lúdico con imágenes","pista":"Todos empiezan con la letra que no suena.","orden":29}}',
    1);

-- 30. Más palabras con h
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Más palabras con h' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Más palabras con h',
    'Mira los dibujos y escribe el nombre de cada uno, en orden del 1 al 4. Todos empiezan con h.',
    'Ortografía',
    '{"texto_guia":null,"imagen_guia":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgNTIwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjx0ZXh0IHg9IjY1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+nijwvdGV4dD48dGV4dCB4PSI2NSIgeT0iMTM4IiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkQyOEQ5Ij4xPC90ZXh0Pjx0ZXh0IHg9IjE5NSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfprQ8L3RleHQ+PHRleHQgeD0iMTk1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2RDI4RDkiPjI8L3RleHQ+PHRleHQgeD0iMzI1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+NhDwvdGV4dD48dGV4dCB4PSIzMjUiIHk9IjEzOCIgZm9udC1zaXplPSIyOCIgZm9udC13ZWlnaHQ9IjcwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZEMjhEOSI+MzwvdGV4dD48dGV4dCB4PSI0NTUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn6eaPC90ZXh0Pjx0ZXh0IHg9IjQ1NSIgeT0iMTM4IiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkQyOEQ5Ij40PC90ZXh0Pjwvc3ZnPg==","imagen_en_lienzo":false,"evaluacion":{"modo":"imagen","respuestas_aceptadas":["hielo hueso hongo hada"]},"pedagogia":{"metodo":"analitico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Conciencia ortográfica","estrategia":"Dictado lúdico con imágenes","pista":"Hielo y hueso empiezan igual: con h.","orden":30}}',
    1);

-- 31. Palabras largas con h
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Palabras largas con h' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Palabras largas con h',
    'Mira los dibujos y escribe el nombre de cada uno, en orden del 1 al 4. Dilos despacito antes de escribir.',
    'Ortografía',
    '{"texto_guia":null,"imagen_guia":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgNTIwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjx0ZXh0IHg9IjY1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+NlDwvdGV4dD48dGV4dCB4PSI2NSIgeT0iMTM4IiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkQyOEQ5Ij4xPC90ZXh0Pjx0ZXh0IHg9IjE5NSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfpps8L3RleHQ+PHRleHQgeD0iMTk1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjgiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2RDI4RDkiPjI8L3RleHQ+PHRleHQgeD0iMzI1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+QvjwvdGV4dD48dGV4dCB4PSIzMjUiIHk9IjEzOCIgZm9udC1zaXplPSIyOCIgZm9udC13ZWlnaHQ9IjcwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZEMjhEOSI+MzwvdGV4dD48dGV4dCB4PSI0NTUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn4+lPC90ZXh0Pjx0ZXh0IHg9IjQ1NSIgeT0iMTM4IiBmb250LXNpemU9IjI4IiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkQyOEQ5Ij40PC90ZXh0Pjwvc3ZnPg==","imagen_en_lienzo":false,"evaluacion":{"modo":"imagen","respuestas_aceptadas":["hamburguesa hipopótamo huella hospital"]},"pedagogia":{"metodo":"analitico","error_objetivo":"grafias_dudosas","nivel":3,"habilidad":"Conciencia ortográfica","estrategia":"Dictado lúdico con imágenes","pista":"Son palabras largas: ve sílaba por sílaba y no olvides la h del principio.","orden":31}}',
    1);

-- 32. Nombres con H mayúscula
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Nombres con H mayúscula' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Nombres con H mayúscula',
    'Copia los nombres. Los nombres empiezan con mayúscula; aquí es una H.',
    'Ortografía',
    '{"texto_guia":"Hugo y Hilda","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["Hugo y Hilda"]},"pedagogia":{"metodo":"analitico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Conciencia ortográfica","estrategia":"Copia de modelo","pista":"Hugo y Hilda son nombres: empiezan con H grande.","orden":32}}',
    1);

-- 33. La h escondida
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La h escondida' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La h escondida',
    'Copia la oración. Busca las dos palabras que tienen una h en medio.',
    'Ortografía',
    '{"texto_guia":"El búho ve la zanahoria.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["El búho ve la zanahoria."]},"pedagogia":{"metodo":"eclectico","error_objetivo":"grafias_dudosas","nivel":3,"habilidad":"Conciencia ortográfica","estrategia":"Copia de modelo","pista":"La h también se esconde en medio: bú-h-o, zana-h-oria.","orden":33}}',
    1);

-- 34. En el huerto
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'En el huerto' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'En el huerto',
    'Copia la oración. Cuenta cuántas palabras empiezan con h.',
    'Ortografía',
    '{"texto_guia":"Hoy hay higos en el huerto.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["Hoy hay higos en el huerto."]},"pedagogia":{"metodo":"eclectico","error_objetivo":"grafias_dudosas","nivel":3,"habilidad":"Conciencia ortográfica","estrategia":"Copia de modelo","pista":"Son cuatro palabras con h. ¡Encuéntralas todas!","orden":34}}',
    1);

-- 35. Hay y ¡ay!
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Hay y ¡ay!' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Hay y ¡ay!',
    'Copia las dos oraciones. Hay con h dice que algo existe; ¡ay! sin h es un quejido.',
    'Ortografía',
    '{"texto_guia":"Hay un gato. ¡Ay, me caí!","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["Hay un gato. ¡Ay, me caí!"]},"pedagogia":{"metodo":"analitico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Conciencia ortográfica","estrategia":"Copia de modelo","pista":"Si te duele, ¡ay! va sin h y entre signos.","orden":35}}',
    1);

-- 36. ¿Hay o ay?
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = '¿Hay o ay?' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    '¿Hay o ay?',
    'Lee las oraciones y escríbelas completas, con hay o con ay.',
    'Ortografía',
    '{"texto_guia":"En el parque ___ árboles. ¡___, qué frío!","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["En el parque hay árboles. ¡Ay, qué frío!"]},"pedagogia":{"metodo":"eclectico","error_objetivo":"grafias_dudosas","nivel":3,"habilidad":"Conciencia ortográfica","estrategia":"Completar oraciones","pista":"¿Hay algo en el parque? Entonces lleva h.","orden":36}}',
    1);

-- 37. Ahí, aquí, allí
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Ahí, aquí, allí' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Ahí, aquí, allí',
    'Copia las palabras. Las tres llevan rayita (tilde) en la i.',
    'Ortografía',
    '{"texto_guia":"ahí aquí allí","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["ahí aquí allí"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"tildes","nivel":2,"habilidad":"Identificación de la sílaba tónica y uso de la tilde","estrategia":"Desafíos visuales","pista":"Las tres terminan en í con rayita.","orden":37}}',
    1);

-- 38. Está ahí
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Está ahí' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Está ahí',
    'Copia la oración. Tiene tres rayitas (tildes); no olvides ninguna.',
    'Ortografía',
    '{"texto_guia":"Mi lápiz está ahí.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["Mi lápiz está ahí."]},"pedagogia":{"metodo":"eclectico","error_objetivo":"tildes","nivel":3,"habilidad":"Identificación de la sílaba tónica y uso de la tilde","estrategia":"Desafíos visuales","pista":"Busca las tres rayitas: lá-piz, es-tá, a-hí.","orden":38}}',
    1);

-- 39. La rayita de está
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La rayita de está' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La rayita de está',
    'Copia la oración. Está lleva rayita en la a del final.',
    'Ortografía',
    '{"texto_guia":"Ana está feliz.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["Ana está feliz."]},"pedagogia":{"metodo":"analitico","error_objetivo":"tildes","nivel":2,"habilidad":"Identificación de la sílaba tónica y uso de la tilde","estrategia":"Desafíos visuales","pista":"Di «es-TÁ»: la fuerza va al final, ahí va la rayita.","orden":39}}',
    1);

-- 40. ¿Esta o está?
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = '¿Esta o está?' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    '¿Esta o está?',
    'Escribe la oración completa. Una palabra lleva rayita y la otra no.',
    'Ortografía',
    '{"texto_guia":"___ silla ___ rota.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["Esta silla está rota."]},"pedagogia":{"metodo":"eclectico","error_objetivo":"tildes","nivel":3,"habilidad":"Identificación de la sílaba tónica y uso de la tilde","estrategia":"Desafíos visuales","pista":"«ESta silla» señala; «esTÁ rota» dice cómo se encuentra.","orden":40}}',
    1);

-- 41. La a va solita
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La a va solita' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La a va solita',
    'Copia la oración. La a es una palabra: va separada, con espacio antes y después.',
    'Ortografía',
    '{"texto_guia":"Voy a la escuela.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["Voy a la escuela."]},"pedagogia":{"metodo":"analitico","error_objetivo":"omision_adicion","nivel":2,"habilidad":"Procesamiento fonológico","estrategia":"Conciencia léxica (separar palabras)","pista":"Cuenta las palabras con tus dedos: Voy · a · la · escuela. ¡Son cuatro!","orden":41}}',
    1);

-- 42. Separa las palabras
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Separa las palabras' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Separa las palabras',
    'Las palabras se juntaron. Escribe la oración separando cada palabra.',
    'Ortografía',
    '{"texto_guia":"Vamosalaplaya.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["Vamos a la playa."]},"pedagogia":{"metodo":"eclectico","error_objetivo":"omision_adicion","nivel":3,"habilidad":"Procesamiento fonológico","estrategia":"Conciencia léxica (separar palabras)","pista":"Léela en voz alta y aplaude en cada palabra.","orden":42}}',
    1);

-- 43. La y une palabras
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La y une palabras' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La y une palabras',
    'Copia las palabras. La y es una palabra pequeñita que va separada.',
    'Ortografía',
    '{"texto_guia":"leche y miel, mar y arena","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["leche y miel, mar y arena"]},"pedagogia":{"metodo":"analitico","error_objetivo":"omision_adicion","nivel":2,"habilidad":"Procesamiento fonológico","estrategia":"Conciencia léxica (separar palabras)","pista":"Deja un espacio antes y después de la y.","orden":43}}',
    1);

-- 44. Separa con espacios
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Separa con espacios' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Separa con espacios',
    'Las palabras se juntaron. Escribe la oración separando cada palabra. Los nombres llevan mayúscula.',
    'Ortografía',
    '{"texto_guia":"Pacoyandreajuegan.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["Paco y Andrea juegan."]},"pedagogia":{"metodo":"eclectico","error_objetivo":"omision_adicion","nivel":3,"habilidad":"Procesamiento fonológico","estrategia":"Conciencia léxica (separar palabras)","pista":"Hay dos nombres y una y en medio.","orden":44}}',
    1);

-- 45. Pregunta y respuesta
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Pregunta y respuesta' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Pregunta y respuesta',
    'Copia la pregunta y la respuesta. Para preguntar se escribe «por qué», separado y con rayita; para responder, «porque», junto.',
    'Ortografía',
    '{"texto_guia":"¿Por qué ríes? Porque estoy contento.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["¿Por qué ríes? Porque estoy contento."]},"pedagogia":{"metodo":"analitico","error_objetivo":"tildes","nivel":3,"habilidad":"Identificación de la sílaba tónica y uso de la tilde","estrategia":"Desafíos visuales","pista":"Pregunta: por qué (separado, con rayita). Respuesta: porque (junto).","orden":45}}',
    1);

-- 46. ¿Por qué o porque?
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = '¿Por qué o porque?' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    '¿Por qué o porque?',
    'Escribe la pregunta y la respuesta completas, con «por qué» o con «porque».',
    'Ortografía',
    '{"texto_guia":"¿___ corre el perro? ___ ve un gato.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["¿Por qué corre el perro? Porque ve un gato."]},"pedagogia":{"metodo":"eclectico","error_objetivo":"tildes","nivel":3,"habilidad":"Identificación de la sílaba tónica y uso de la tilde","estrategia":"Desafíos visuales","pista":"Si hay signos de pregunta, va «por qué» con rayita.","orden":46}}',
    1);

-- 47. Yo también
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Yo también' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Yo también',
    'Copia la oración. También es una sola palabra y lleva rayita en la e.',
    'Ortografía',
    '{"texto_guia":"Yo también como pan.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["Yo también como pan."]},"pedagogia":{"metodo":"analitico","error_objetivo":"tildes","nivel":2,"habilidad":"Identificación de la sílaba tónica y uso de la tilde","estrategia":"Desafíos visuales","pista":"Di «tam-BIÉN»: va junto y con rayita.","orden":47}}',
    1);

-- 48. Todo junto con h
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Todo junto con h' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Todo junto con h',
    'Copia la oración con tu mejor letra: con h, rayitas y espacios entre palabras.',
    'Ortografía',
    '{"texto_guia":"Ahí está el búho y también la hormiga.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["Ahí está el búho y también la hormiga."]},"pedagogia":{"metodo":"eclectico","error_objetivo":"integracion","nivel":3,"habilidad":"Integración de ortografía y trazo","estrategia":"Copia de modelo","pista":"Revisa al final: tres h, cuatro rayitas y la y separada.","orden":48}}',
    1);
GO
