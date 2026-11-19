-- GENERADO por BD/catalogo/generar_migracion.py a partir de catalogo_ejercicios.json; no editar a mano.
-- Ampliación del catálogo (lote 3) y etiquetas en las imágenes existentes.
-- Los tutores deben activarlos para que sus alumnos los vean.
USE TT;
GO

UPDATE dbo.Ejercicios
SET contenido_base = JSON_MODIFY(JSON_MODIFY(contenido_base, '$.imagen_guia',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgNTIwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNjUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn42977iPPC90ZXh0Pjx0ZXh0IHg9IjY1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPnBsYXRvPC90ZXh0PjxyZWN0IHg9IjEzMyIgeT0iMyIgd2lkdGg9IjEyNCIgaGVpZ2h0PSIxNTAiIHJ4PSIxNCIgZmlsbD0iI0ZGRkJFQiIgc3Ryb2tlPSIjRDk3NzA2IiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIxOTUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn4y4PC90ZXh0Pjx0ZXh0IHg9IjE5NSIgeT0iMTM4IiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMjkyNTI0Ij5mbG9yPC90ZXh0PjxyZWN0IHg9IjI2MyIgeT0iMyIgd2lkdGg9IjEyNCIgaGVpZ2h0PSIxNTAiIHJ4PSIxNCIgZmlsbD0iI0ZGRkJFQiIgc3Ryb2tlPSIjRDk3NzA2IiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIzMjUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn46IPC90ZXh0Pjx0ZXh0IHg9IjMyNSIgeT0iMTM4IiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMjkyNTI0Ij5nbG9ibzwvdGV4dD48cmVjdCB4PSIzOTMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNDU1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+agjwvdGV4dD48dGV4dCB4PSI0NTUiIHk9IjEzOCIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9IjcwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzI5MjUyNCI+dHJlbjwvdGV4dD48L3N2Zz4='), '$.tarjetas_imagen', JSON_QUERY('[{"dibujo":"\ud83c\udf7d\ufe0f","palabra":"plato"},{"dibujo":"\ud83c\udf38","palabra":"flor"},{"dibujo":"\ud83c\udf88","palabra":"globo"},{"dibujo":"\ud83d\ude82","palabra":"tren"}]')),
    descripcion = 'Copia las palabras que aparecen debajo de los dibujos, de izquierda a derecha.'
WHERE titulo = 'Sílabas trabadas: escribe lo que ves' AND id_tutor_creador IS NULL
  AND ISJSON(contenido_base) = 1;

UPDATE dbo.Ejercicios
SET contenido_base = JSON_MODIFY(JSON_MODIFY(contenido_base, '$.imagen_guia',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgNTIwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNjUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5CEPC90ZXh0Pjx0ZXh0IHg9IjY1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPnZhY2E8L3RleHQ+PHJlY3QgeD0iMTMzIiB5PSIzIiB3aWR0aD0iMTI0IiBoZWlnaHQ9IjE1MCIgcng9IjE0IiBmaWxsPSIjRkZGQkVCIiBzdHJva2U9IiNEOTc3MDYiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjE5NSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfjYc8L3RleHQ+PHRleHQgeD0iMTk1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPnV2YXM8L3RleHQ+PHJlY3QgeD0iMjYzIiB5PSIzIiB3aWR0aD0iMTI0IiBoZWlnaHQ9IjE1MCIgcng9IjE0IiBmaWxsPSIjRkZGQkVCIiBzdHJva2U9IiNEOTc3MDYiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjMyNSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfkaI8L3RleHQ+PHRleHQgeD0iMzI1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPmJvdGE8L3RleHQ+PHJlY3QgeD0iMzkzIiB5PSIzIiB3aWR0aD0iMTI0IiBoZWlnaHQ9IjE1MCIgcng9IjE0IiBmaWxsPSIjRkZGQkVCIiBzdHJva2U9IiNEOTc3MDYiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjQ1NSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKYge+4jzwvdGV4dD48dGV4dCB4PSI0NTUiIHk9IjEzOCIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9IjcwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzI5MjUyNCI+bnViZTwvdGV4dD48L3N2Zz4='), '$.tarjetas_imagen', JSON_QUERY('[{"dibujo":"\ud83d\udc04","palabra":"vaca"},{"dibujo":"\ud83c\udf47","palabra":"uvas"},{"dibujo":"\ud83d\udc62","palabra":"bota"},{"dibujo":"\u2601\ufe0f","palabra":"nube"}]')),
    descripcion = 'Copia las palabras que aparecen debajo de los dibujos, de izquierda a derecha.'
WHERE titulo = '¿B o V? Escribe lo que ves' AND id_tutor_creador IS NULL
  AND ISJSON(contenido_base) = 1;

UPDATE dbo.Ejercicios
SET contenido_base = JSON_MODIFY(JSON_MODIFY(contenido_base, '$.imagen_guia',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgNTIwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNjUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5GePC90ZXh0Pjx0ZXh0IHg9IjY1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPnphcGF0bzwvdGV4dD48cmVjdCB4PSIxMzMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMTk1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+PoDwvdGV4dD48dGV4dCB4PSIxOTUiIHk9IjEzOCIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9IjcwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzI5MjUyNCI+Y2FzYTwvdGV4dD48cmVjdCB4PSIyNjMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMzI1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+NsjwvdGV4dD48dGV4dCB4PSIzMjUiIHk9IjEzOCIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9IjcwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzI5MjUyNCI+c29wYTwvdGV4dD48cmVjdCB4PSIzOTMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNDU1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+QuzwvdGV4dD48dGV4dCB4PSI0NTUiIHk9IjEzOCIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9IjcwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzI5MjUyNCI+b3NvPC90ZXh0Pjwvc3ZnPg=='), '$.tarjetas_imagen', JSON_QUERY('[{"dibujo":"\ud83d\udc5e","palabra":"zapato"},{"dibujo":"\ud83c\udfe0","palabra":"casa"},{"dibujo":"\ud83c\udf72","palabra":"sopa"},{"dibujo":"\ud83d\udc3b","palabra":"oso"}]')),
    descripcion = 'Copia las palabras que aparecen debajo de los dibujos, de izquierda a derecha.'
WHERE titulo = '¿C, S o Z? Escribe lo que ves' AND id_tutor_creador IS NULL
  AND ISJSON(contenido_base) = 1;

UPDATE dbo.Ejercicios
SET contenido_base = JSON_MODIFY(JSON_MODIFY(contenido_base, '$.imagen_guia',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgNTIwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNjUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn6eAPC90ZXh0Pjx0ZXh0IHg9IjY1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPnF1ZXNvPC90ZXh0PjxyZWN0IHg9IjEzMyIgeT0iMyIgd2lkdGg9IjEyNCIgaGVpZ2h0PSIxNTAiIHJ4PSIxNCIgZmlsbD0iI0ZGRkJFQiIgc3Ryb2tlPSIjRDk3NzA2IiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIxOTUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn6WdPC90ZXh0Pjx0ZXh0IHg9IjE5NSIgeT0iMTM4IiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMjkyNTI0Ij5raXdpPC90ZXh0PjxyZWN0IHg9IjI2MyIgeT0iMyIgd2lkdGg9IjEyNCIgaGVpZ2h0PSIxNTAiIHJ4PSIxNCIgZmlsbD0iI0ZGRkJFQiIgc3Ryb2tlPSIjRDk3NzA2IiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIzMjUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5CwPC90ZXh0Pjx0ZXh0IHg9IjMyNSIgeT0iMTM4IiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMjkyNTI0Ij5jb25lam88L3RleHQ+PHJlY3QgeD0iMzkzIiB5PSIzIiB3aWR0aD0iMTI0IiBoZWlnaHQ9IjE1MCIgcng9IjE0IiBmaWxsPSIjRkZGQkVCIiBzdHJva2U9IiNEOTc3MDYiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjQ1NSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfpYQ8L3RleHQ+PHRleHQgeD0iNDU1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPmN1Y2hhcmE8L3RleHQ+PC9zdmc+'), '$.tarjetas_imagen', JSON_QUERY('[{"dibujo":"\ud83e\uddc0","palabra":"queso"},{"dibujo":"\ud83e\udd5d","palabra":"kiwi"},{"dibujo":"\ud83d\udc30","palabra":"conejo"},{"dibujo":"\ud83e\udd44","palabra":"cuchara"}]')),
    descripcion = 'Copia las palabras que aparecen debajo de los dibujos, de izquierda a derecha.'
WHERE titulo = '¿C, K o QU? Escribe lo que ves' AND id_tutor_creador IS NULL
  AND ISJSON(contenido_base) = 1;

UPDATE dbo.Ejercicios
SET contenido_base = JSON_MODIFY(JSON_MODIFY(contenido_base, '$.imagen_guia',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgNTIwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNjUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn46yPC90ZXh0Pjx0ZXh0IHg9IjY1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPmRhZG88L3RleHQ+PHJlY3QgeD0iMTMzIiB5PSIzIiB3aWR0aD0iMTI0IiBoZWlnaHQ9IjE1MCIgcng9IjE0IiBmaWxsPSIjRkZGQkVCIiBzdHJva2U9IiNEOTc3MDYiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjE5NSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfkbY8L3RleHQ+PHRleHQgeD0iMTk1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPmJlYsOpPC90ZXh0PjxyZWN0IHg9IjI2MyIgeT0iMyIgd2lkdGg9IjEyNCIgaGVpZ2h0PSIxNTAiIHJ4PSIxNCIgZmlsbD0iI0ZGRkJFQiIgc3Ryb2tlPSIjRDk3NzA2IiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIzMjUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7imJ3vuI88L3RleHQ+PHRleHQgeD0iMzI1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPmRlZG88L3RleHQ+PHJlY3QgeD0iMzkzIiB5PSIzIiB3aWR0aD0iMTI0IiBoZWlnaHQ9IjE1MCIgcng9IjE0IiBmaWxsPSIjRkZGQkVCIiBzdHJva2U9IiNEOTc3MDYiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjQ1NSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfkYQ8L3RleHQ+PHRleHQgeD0iNDU1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPmJvY2E8L3RleHQ+PC9zdmc+'), '$.tarjetas_imagen', JSON_QUERY('[{"dibujo":"\ud83c\udfb2","palabra":"dado"},{"dibujo":"\ud83d\udc76","palabra":"beb\u00e9"},{"dibujo":"\u261d\ufe0f","palabra":"dedo"},{"dibujo":"\ud83d\udc44","palabra":"boca"}]')),
    descripcion = 'Copia las palabras que aparecen debajo de los dibujos, de izquierda a derecha.'
WHERE titulo = '¿B o D? Mira bien' AND id_tutor_creador IS NULL
  AND ISJSON(contenido_base) = 1;

UPDATE dbo.Ejercicios
SET contenido_base = JSON_MODIFY(JSON_MODIFY(contenido_base, '$.imagen_guia',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgNTIwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNjUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5CtPC90ZXh0Pjx0ZXh0IHg9IjY1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPnJhdMOzbjwvdGV4dD48cmVjdCB4PSIxMzMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMTk1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+NizwvdGV4dD48dGV4dCB4PSIxOTUiIHk9IjEzOCIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9IjcwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzI5MjUyNCI+bGltw7NuPC90ZXh0PjxyZWN0IHg9IjI2MyIgeT0iMyIgd2lkdGg9IjEyNCIgaGVpZ2h0PSIxNTAiIHJ4PSIxNCIgZmlsbD0iI0ZGRkJFQiIgc3Ryb2tlPSIjRDk3NzA2IiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIzMjUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7inIjvuI88L3RleHQ+PHRleHQgeD0iMzI1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPmF2acOzbjwvdGV4dD48cmVjdCB4PSIzOTMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNDU1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+amjwvdGV4dD48dGV4dCB4PSI0NTUiIHk9IjEzOCIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9IjcwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzI5MjUyNCI+Y2FtacOzbjwvdGV4dD48L3N2Zz4='), '$.tarjetas_imagen', JSON_QUERY('[{"dibujo":"\ud83d\udc2d","palabra":"rat\u00f3n"},{"dibujo":"\ud83c\udf4b","palabra":"lim\u00f3n"},{"dibujo":"\u2708\ufe0f","palabra":"avi\u00f3n"},{"dibujo":"\ud83d\ude9a","palabra":"cami\u00f3n"}]')),
    descripcion = 'Copia las palabras que aparecen debajo de los dibujos, de izquierda a derecha.'
WHERE titulo = '¿Dónde va la tilde?' AND id_tutor_creador IS NULL
  AND ISJSON(contenido_base) = 1;

UPDATE dbo.Ejercicios
SET contenido_base = JSON_MODIFY(JSON_MODIFY(contenido_base, '$.imagen_guia',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgNTIwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNjUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn6WaPC90ZXh0Pjx0ZXh0IHg9IjY1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPmh1ZXZvPC90ZXh0PjxyZWN0IHg9IjEzMyIgeT0iMyIgd2lkdGg9IjEyNCIgaGVpZ2h0PSIxNTAiIHJ4PSIxNCIgZmlsbD0iI0ZGRkJFQiIgc3Ryb2tlPSIjRDk3NzA2IiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIxOTUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn42mPC90ZXh0Pjx0ZXh0IHg9IjE5NSIgeT0iMTM4IiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMjkyNTI0Ij5oZWxhZG88L3RleHQ+PHJlY3QgeD0iMjYzIiB5PSIzIiB3aWR0aD0iMTI0IiBoZWlnaHQ9IjE1MCIgcng9IjE0IiBmaWxsPSIjRkZGQkVCIiBzdHJva2U9IiNEOTc3MDYiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjMyNSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfjYM8L3RleHQ+PHRleHQgeD0iMzI1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPmhvamE8L3RleHQ+PHJlY3QgeD0iMzkzIiB5PSIzIiB3aWR0aD0iMTI0IiBoZWlnaHQ9IjE1MCIgcng9IjE0IiBmaWxsPSIjRkZGQkVCIiBzdHJva2U9IiNEOTc3MDYiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjQ1NSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfkJw8L3RleHQ+PHRleHQgeD0iNDU1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPmhvcm1pZ2E8L3RleHQ+PC9zdmc+'), '$.tarjetas_imagen', JSON_QUERY('[{"dibujo":"\ud83e\udd5a","palabra":"huevo"},{"dibujo":"\ud83c\udf66","palabra":"helado"},{"dibujo":"\ud83c\udf43","palabra":"hoja"},{"dibujo":"\ud83d\udc1c","palabra":"hormiga"}]')),
    descripcion = 'Copia las palabras que aparecen debajo de los dibujos, de izquierda a derecha.'
WHERE titulo = '¿Lleva h? Escribe lo que ves' AND id_tutor_creador IS NULL
  AND ISJSON(contenido_base) = 1;

UPDATE dbo.Ejercicios
SET contenido_base = JSON_MODIFY(JSON_MODIFY(contenido_base, '$.imagen_guia',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgNTIwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNjUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn6eKPC90ZXh0Pjx0ZXh0IHg9IjY1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPmhpZWxvPC90ZXh0PjxyZWN0IHg9IjEzMyIgeT0iMyIgd2lkdGg9IjEyNCIgaGVpZ2h0PSIxNTAiIHJ4PSIxNCIgZmlsbD0iI0ZGRkJFQiIgc3Ryb2tlPSIjRDk3NzA2IiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIxOTUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn6a0PC90ZXh0Pjx0ZXh0IHg9IjE5NSIgeT0iMTM4IiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMjkyNTI0Ij5odWVzbzwvdGV4dD48cmVjdCB4PSIyNjMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMzI1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+NhDwvdGV4dD48dGV4dCB4PSIzMjUiIHk9IjEzOCIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9IjcwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzI5MjUyNCI+aG9uZ288L3RleHQ+PHJlY3QgeD0iMzkzIiB5PSIzIiB3aWR0aD0iMTI0IiBoZWlnaHQ9IjE1MCIgcng9IjE0IiBmaWxsPSIjRkZGQkVCIiBzdHJva2U9IiNEOTc3MDYiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjQ1NSIgeT0iODgiIGZvbnQtc2l6ZT0iNzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfp5o8L3RleHQ+PHRleHQgeD0iNDU1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPmhhZGE8L3RleHQ+PC9zdmc+'), '$.tarjetas_imagen', JSON_QUERY('[{"dibujo":"\ud83e\uddca","palabra":"hielo"},{"dibujo":"\ud83e\uddb4","palabra":"hueso"},{"dibujo":"\ud83c\udf44","palabra":"hongo"},{"dibujo":"\ud83e\uddda","palabra":"hada"}]')),
    descripcion = 'Copia las palabras que aparecen debajo de los dibujos, de izquierda a derecha.'
WHERE titulo = 'Más palabras con h' AND id_tutor_creador IS NULL
  AND ISJSON(contenido_base) = 1;

UPDATE dbo.Ejercicios
SET contenido_base = JSON_MODIFY(JSON_MODIFY(contenido_base, '$.imagen_guia',
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgNTIwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNjUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn42UPC90ZXh0Pjx0ZXh0IHg9IjY1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPmhhbWJ1cmd1ZXNhPC90ZXh0PjxyZWN0IHg9IjEzMyIgeT0iMyIgd2lkdGg9IjEyNCIgaGVpZ2h0PSIxNTAiIHJ4PSIxNCIgZmlsbD0iI0ZGRkJFQiIgc3Ryb2tlPSIjRDk3NzA2IiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIxOTUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn6abPC90ZXh0Pjx0ZXh0IHg9IjE5NSIgeT0iMTM4IiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMjkyNTI0Ij5oaXBvcMOzdGFtbzwvdGV4dD48cmVjdCB4PSIyNjMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMzI1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+QvjwvdGV4dD48dGV4dCB4PSIzMjUiIHk9IjEzOCIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9IjcwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzI5MjUyNCI+aHVlbGxhPC90ZXh0PjxyZWN0IHg9IjM5MyIgeT0iMyIgd2lkdGg9IjEyNCIgaGVpZ2h0PSIxNTAiIHJ4PSIxNCIgZmlsbD0iI0ZGRkJFQiIgc3Ryb2tlPSIjRDk3NzA2IiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI0NTUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn4+lPC90ZXh0Pjx0ZXh0IHg9IjQ1NSIgeT0iMTM4IiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMjkyNTI0Ij5ob3NwaXRhbDwvdGV4dD48L3N2Zz4='), '$.tarjetas_imagen', JSON_QUERY('[{"dibujo":"\ud83c\udf54","palabra":"hamburguesa"},{"dibujo":"\ud83e\udd9b","palabra":"hipop\u00f3tamo"},{"dibujo":"\ud83d\udc3e","palabra":"huella"},{"dibujo":"\ud83c\udfe5","palabra":"hospital"}]')),
    descripcion = 'Copia las palabras que aparecen debajo de los dibujos, de izquierda a derecha.'
WHERE titulo = 'Palabras largas con h' AND id_tutor_creador IS NULL
  AND ISJSON(contenido_base) = 1;
GO

-- 49. La a grande y la a pequeña
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La a grande y la a pequeña' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La a grande y la a pequeña',
    'Copia las cuatro letras en el orden del modelo.',
    'Legibilidad',
    '{"texto_guia":"A a A a","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["A a A a"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"trazo","nivel":1,"habilidad":"Forma y tamaño de la letra","estrategia":"Copia de modelo","pista":"Observa que la A tiene una barra y que la a minúscula es redonda.","grupo":"vocales","orden_grupo":2,"orden":49}}',
    1);

-- 50. Palabras que empiezan con a
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Palabras que empiezan con a' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Palabras que empiezan con a',
    'Completa cada palabra con a. Escribe las tres palabras completas.',
    'Ortografía',
    '{"texto_guia":"_la   _nillo   _beja","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["ala anillo abeja"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Identificación de vocales en palabras","estrategia":"Completar palabras","pista":"Di la vocal a antes de leer cada palabra.","grupo":"vocales","orden_grupo":3,"orden":50}}',
    1);

-- 51. Dos dibujos que empiezan con a
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Dos dibujos que empiezan con a' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Dos dibujos que empiezan con a',
    'Copia los nombres debajo de los dibujos, de izquierda a derecha.',
    'Ortografía',
    '{"texto_guia":null,"imagen_guia":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgMjYwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNjUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5W377iPPC90ZXh0Pjx0ZXh0IHg9IjY1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPmFyYcOxYTwvdGV4dD48cmVjdCB4PSIxMzMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMTk1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+Qv++4jzwvdGV4dD48dGV4dCB4PSIxOTUiIHk9IjEzOCIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9IjcwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzI5MjUyNCI+YXJkaWxsYTwvdGV4dD48L3N2Zz4=","imagen_en_lienzo":false,"evaluacion":{"modo":"imagen","respuestas_aceptadas":["ara\u00f1a ardilla"]},"pedagogia":{"metodo":"analitico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Reconocimiento de la vocal inicial","estrategia":"Copia con apoyo visual","pista":"Se\u00f1ala la a al comienzo de cada nombre.","grupo":"vocales","orden_grupo":4,"orden":51},"tarjetas_imagen":[{"dibujo":"\ud83d\udd77\ufe0f","palabra":"ara\u00f1a"},{"dibujo":"\ud83d\udc3f\ufe0f","palabra":"ardilla"}]}',
    1);

-- 52. La e grande y la e pequeña
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La e grande y la e pequeña' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La e grande y la e pequeña',
    'Copia las cuatro letras y deja un espacio entre ellas.',
    'Legibilidad',
    '{"texto_guia":"E E e e","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["E E e e"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"trazo","nivel":1,"habilidad":"Forma y tamaño de la letra","estrategia":"Copia de modelo","pista":"En la E mayúscula, revisa que se vean las tres rayas horizontales.","grupo":"vocales","orden_grupo":5,"orden":52}}',
    1);

-- 53. Palabras que empiezan con e
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Palabras que empiezan con e' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Palabras que empiezan con e',
    'Completa con e y escribe las palabras completas.',
    'Ortografía',
    '{"texto_guia":"_rizo   _lote   _spejo","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["erizo elote espejo"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Identificación de vocales en palabras","estrategia":"Completar palabras","pista":"Las tres palabras comparten la primera vocal.","grupo":"vocales","orden_grupo":6,"orden":53}}',
    1);

-- 54. La e debajo de cada dibujo
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La e debajo de cada dibujo' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La e debajo de cada dibujo',
    'Copia las dos palabras debajo de los dibujos, de izquierda a derecha.',
    'Ortografía',
    '{"texto_guia":null,"imagen_guia":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgMjYwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNjUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5CYPC90ZXh0Pjx0ZXh0IHg9IjY1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPmVsZWZhbnRlPC90ZXh0PjxyZWN0IHg9IjEzMyIgeT0iMyIgd2lkdGg9IjEyNCIgaGVpZ2h0PSIxNTAiIHJ4PSIxNCIgZmlsbD0iI0ZGRkJFQiIgc3Ryb2tlPSIjRDk3NzA2IiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIxOTUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7irZA8L3RleHQ+PHRleHQgeD0iMTk1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPmVzdHJlbGxhPC90ZXh0Pjwvc3ZnPg==","imagen_en_lienzo":false,"evaluacion":{"modo":"imagen","respuestas_aceptadas":["elefante estrella"]},"pedagogia":{"metodo":"analitico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Reconocimiento de la vocal inicial","estrategia":"Copia con apoyo visual","pista":"Busca la e inicial y observa d\u00f3nde m\u00e1s aparece en cada palabra.","grupo":"vocales","orden_grupo":7,"orden":54},"tarjetas_imagen":[{"dibujo":"\ud83d\udc18","palabra":"elefante"},{"dibujo":"\u2b50","palabra":"estrella"}]}',
    1);

-- 55. La i grande y la i pequeña
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La i grande y la i pequeña' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La i grande y la i pequeña',
    'Copia las letras en el mismo orden. Agrega el punto de cada i minúscula.',
    'Legibilidad',
    '{"texto_guia":"I i i I","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["I i i I"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"trazo","nivel":1,"habilidad":"Forma y tamaño de la letra","estrategia":"Copia de modelo","pista":"El punto va arriba de la i minúscula.","grupo":"vocales","orden_grupo":8,"orden":55}}',
    1);

-- 56. Palabras que empiezan con i
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Palabras que empiezan con i' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Palabras que empiezan con i',
    'Escribe las palabras completas con i al inicio. Conserva las tildes del modelo.',
    'Ortografía',
    '{"texto_guia":"_mán   _sla   _dea","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["imán isla idea"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Identificación de vocales en palabras","estrategia":"Completar palabras","pista":"Pronuncia la primera vocal antes de copiar el resto de la palabra.","grupo":"vocales","orden_grupo":9,"orden":56}}',
    1);

-- 57. La i en medio de la palabra
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La i en medio de la palabra' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La i en medio de la palabra',
    'Completa cada palabra con i y escríbela completa.',
    'Ortografía',
    '{"texto_guia":"p_no   s_rena   c_ne","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["pino sirena cine"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Identificación de vocales en palabras","estrategia":"Completar palabras","pista":"Busca el hueco dentro de la palabra y revisa el punto de cada i.","grupo":"vocales","orden_grupo":10,"orden":57}}',
    1);

-- 58. La o grande y la o pequeña
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La o grande y la o pequeña' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La o grande y la o pequeña',
    'Copia las cuatro letras y cierra cada círculo.',
    'Legibilidad',
    '{"texto_guia":"O o o O","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["O o o O"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"trazo","nivel":1,"habilidad":"Forma y tamaño de la letra","estrategia":"Copia de modelo","pista":"La O grande y la o pequeña se distinguen por su tamaño.","grupo":"vocales","orden_grupo":11,"orden":58}}',
    1);

-- 59. Palabras que empiezan con o
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Palabras que empiezan con o' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Palabras que empiezan con o',
    'Completa con o y escribe cada palabra sin dejar el hueco.',
    'Ortografía',
    '{"texto_guia":"_lla   _ruga   _veja","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["olla oruga oveja"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Identificación de vocales en palabras","estrategia":"Completar palabras","pista":"La o es la primera letra de las tres palabras.","grupo":"vocales","orden_grupo":12,"orden":59}}',
    1);

-- 60. Dos partes del cuerpo con o
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Dos partes del cuerpo con o' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Dos partes del cuerpo con o',
    'Copia las palabras que aparecen debajo de los dibujos.',
    'Ortografía',
    '{"texto_guia":null,"imagen_guia":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNjAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgMjYwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNjUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5GB77iPPC90ZXh0Pjx0ZXh0IHg9IjY1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPm9qbzwvdGV4dD48cmVjdCB4PSIxMzMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMTk1IiB5PSI4OCIgZm9udC1zaXplPSI3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+RgjwvdGV4dD48dGV4dCB4PSIxOTUiIHk9IjEzOCIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9IjcwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzI5MjUyNCI+b3JlamE8L3RleHQ+PC9zdmc+","imagen_en_lienzo":false,"evaluacion":{"modo":"imagen","respuestas_aceptadas":["ojo oreja"]},"pedagogia":{"metodo":"analitico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Reconocimiento de la vocal inicial","estrategia":"Copia con apoyo visual","pista":"F\u00edjate en la letra que tienen en com\u00fan al principio.","grupo":"vocales","orden_grupo":13,"orden":60},"tarjetas_imagen":[{"dibujo":"\ud83d\udc41\ufe0f","palabra":"ojo"},{"dibujo":"\ud83d\udc42","palabra":"oreja"}]}',
    1);

-- 61. La u grande y la u pequeña
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La u grande y la u pequeña' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La u grande y la u pequeña',
    'Copia las letras. Deja un espacio entre ellas.',
    'Legibilidad',
    '{"texto_guia":"U u U u","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["U u U u"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"trazo","nivel":1,"habilidad":"Forma y tamaño de la letra","estrategia":"Copia de modelo","pista":"La U tiene una curva abierta arriba. Haz la u minúscula más pequeña.","grupo":"vocales","orden_grupo":14,"orden":61}}',
    1);

-- 62. Palabras que empiezan con u
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Palabras que empiezan con u' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Palabras que empiezan con u',
    'Agrega la u inicial y escribe las tres palabras completas.',
    'Ortografía',
    '{"texto_guia":"_no   _ña   _niforme","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["uno uña uniforme"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Identificación de vocales en palabras","estrategia":"Completar palabras","pista":"Pronuncia la u al leer cada palabra.","grupo":"vocales","orden_grupo":15,"orden":62}}',
    1);

-- 63. La u del unicornio
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La u del unicornio' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La u del unicornio',
    'Mira el dibujo y copia la palabra que aparece debajo.',
    'Ortografía',
    '{"texto_guia":null,"imagen_guia":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMzAiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwIDAgMTMwIDE1NiIgZm9udC1mYW1pbHk9IkFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLE5vdG8gQ29sb3IgRW1vamksTnVuaXRvLHNhbnMtc2VyaWYiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxMjQiIGhlaWdodD0iMTUwIiByeD0iMTQiIGZpbGw9IiNGRkZCRUIiIHN0cm9rZT0iI0Q5NzcwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNjUiIHk9Ijg4IiBmb250LXNpemU9IjcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn6aEPC90ZXh0Pjx0ZXh0IHg9IjY1IiB5PSIxMzgiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMyOTI1MjQiPnVuaWNvcm5pbzwvdGV4dD48L3N2Zz4=","imagen_en_lienzo":false,"evaluacion":{"modo":"imagen","respuestas_aceptadas":["unicornio"]},"pedagogia":{"metodo":"analitico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Reconocimiento de la vocal inicial","estrategia":"Copia con apoyo visual","pista":"Localiza la u al principio y sigue copiando letra por letra.","grupo":"vocales","orden_grupo":16,"orden":63},"tarjetas_imagen":[{"dibujo":"\ud83e\udd84","palabra":"unicornio"}]}',
    1);

-- 64. Una a o una e
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Una a o una e' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Una a o una e',
    'Completa con a o e según la pista de cada renglón. Escribe solo las palabras completas.',
    'Ortografía',
    '{"texto_guia":"Material de un suéter: l_na\nManchitas en la piel: p_cas","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["lana pecas"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Identificación de vocales en palabras","estrategia":"Completar palabras","pista":"Lee la pista y prueba en voz alta las dos vocales.","grupo":"vocales","orden_grupo":17,"orden":64}}',
    1);

-- 65. Una i o una o
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Una i o una o' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Una i o una o',
    'Completa con í u o según la pista. Escribe solo las palabras completas.',
    'Ortografía',
    '{"texto_guia":"Animal marino que salta: delf_n\nAnimal que trepa árboles: m_no","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["delfín mono"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Identificación de vocales en palabras","estrategia":"Completar palabras","pista":"La primera palabra tiene í con tilde. La segunda tiene o.","grupo":"vocales","orden_grupo":18,"orden":65}}',
    1);

-- 66. Las cinco vocales al final
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Las cinco vocales al final' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Las cinco vocales al final',
    'Completa el final de cada palabra con la vocal entre paréntesis. Escribe solo las palabras completas.',
    'Ortografía',
    '{"texto_guia":"comet_ (a)\ndulc_ (e)\ncolibr_ (í)\npati_ (o)\ntrib_ (u)","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["cometa dulce colibrí patio tribu"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Identificación de vocales en palabras","estrategia":"Completar palabras","pista":"Revisa la última letra de cada palabra y conserva la tilde de la í.","grupo":"vocales","orden_grupo":19,"orden":66}}',
    1);

-- 67. Nombres que empiezan con vocal
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Nombres que empiezan con vocal' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Nombres que empiezan con vocal',
    'Escribe los nombres completos. Usa la vocal mayúscula entre paréntesis.',
    'Ortografía',
    '{"texto_guia":"_lma (A)\n_lena (E)\n_ris (I)\n_mar (O)\n_lises (U)","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["Alma Elena Iris Omar Ulises"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Identificación de vocales en palabras","estrategia":"Completar palabras","pista":"La primera letra de cada nombre va en mayúscula.","grupo":"vocales","orden_grupo":20,"orden":67}}',
    1);

-- 68. Palabras que empiezan con m
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Palabras que empiezan con m' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Palabras que empiezan con m',
    'Completa las palabras con m al principio y escríbelas completas.',
    'Ortografía',
    '{"texto_guia":"_apa   _oto   _uela","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["mapa moto muela"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Correspondencia entre sonidos y grafías","estrategia":"Completar palabras","pista":"Al decir m, junta los labios antes de pronunciar la vocal.","grupo":"primer-grupo","orden_grupo":2,"orden":68}}',
    1);

-- 69. Une las sílabas con m
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Une las sílabas con m' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Une las sílabas con m',
    'Junta los pedacitos de cada renglón. Escribe una palabra por renglón.',
    'Ortografía',
    '{"texto_guia":"ma + no\nmo + ne + da\nmu + la","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["mano moneda mula"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"omision_adicion","nivel":2,"habilidad":"Conciencia silábica","estrategia":"Unión de sílabas","pista":"Mantén el orden de los pedacitos y júntalos sin espacios.","grupo":"primer-grupo","orden_grupo":3,"orden":69}}',
    1);

-- 70. Las sílabas de la s
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Las sílabas de la s' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Las sílabas de la s',
    'Copia la serie de sílabas. Deja un espacio entre ellas.',
    'Ortografía',
    '{"texto_guia":"se si so su","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["se si so su"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Reconocimiento de grafías en palabras","estrategia":"Copia de modelo","pista":"La s se mantiene al principio aunque la vocal cambie.","grupo":"primer-grupo","orden_grupo":4,"orden":70}}',
    1);

-- 71. La s dentro de las palabras
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La s dentro de las palabras' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La s dentro de las palabras',
    'Completa cada palabra con s. Escribe las palabras completas.',
    'Ortografía',
    '{"texto_guia":"bol_a   pe_ca   cue_ta","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["bolsa pesca cuesta"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Correspondencia entre sonidos y grafías","estrategia":"Completar palabras","pista":"Lee cada palabra despacio y escucha la s dentro de ella.","grupo":"primer-grupo","orden_grupo":5,"orden":71}}',
    1);

-- 72. Palabras que empiezan con t
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Palabras que empiezan con t' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Palabras que empiezan con t',
    'Copia las palabras y fíjate en la t inicial de cada una.',
    'Ortografía',
    '{"texto_guia":"tina tela topo","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["tina tela topo"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Reconocimiento de grafías en palabras","estrategia":"Copia de modelo","pista":"La t se escribe con un palito y una rayita que lo cruza.","grupo":"primer-grupo","orden_grupo":6,"orden":72}}',
    1);

-- 73. Arma palabras con t
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Arma palabras con t' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Arma palabras con t',
    'Une los pedacitos de cada renglón y escribe las palabras completas.',
    'Ortografía',
    '{"texto_guia":"to + ma + te\ntu + na\nti + je + ra","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["tomate tuna tijera"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"omision_adicion","nivel":2,"habilidad":"Conciencia silábica","estrategia":"Unión de sílabas","pista":"La primera sílaba de cada palabra empieza con t.","grupo":"primer-grupo","orden_grupo":7,"orden":73}}',
    1);

-- 74. El palito de la l
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'El palito de la l' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'El palito de la l',
    'Copia las letras. Conserva el tamaño de cada mayúscula y minúscula.',
    'Legibilidad',
    '{"texto_guia":"L l l L","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["L l l L"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"trazo","nivel":1,"habilidad":"Forma y tamaño de la letra","estrategia":"Copia de modelo","pista":"La l minúscula sube más que una vocal minúscula.","grupo":"primer-grupo","orden_grupo":8,"orden":74}}',
    1);

-- 75. La l al comienzo
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La l al comienzo' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La l al comienzo',
    'Completa cada palabra con l y escríbela completa.',
    'Ortografía',
    '{"texto_guia":"_ata   _odo   _upa","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["lata lodo lupa"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Correspondencia entre sonidos y grafías","estrategia":"Completar palabras","pista":"Observa cómo cambia la palabra cuando la l se junta con otra vocal.","grupo":"primer-grupo","orden_grupo":9,"orden":75}}',
    1);

-- 76. La r fuerte al inicio
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La r fuerte al inicio' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La r fuerte al inicio',
    'Copia las palabras y di su primera sílaba en voz alta.',
    'Ortografía',
    '{"texto_guia":"rama risa rueda","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["rama risa rueda"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Reconocimiento de grafías en palabras","estrategia":"Copia de modelo","pista":"Al inicio de una palabra, el sonido fuerte se escribe con una sola r.","grupo":"primer-grupo","orden_grupo":10,"orden":76}}',
    1);

-- 77. Completa con r inicial
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Completa con r inicial' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Completa con r inicial',
    'Escribe las palabras completas con r en el primer espacio.',
    'Ortografía',
    '{"texto_guia":"_ana   _emo   _oca","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["rana remo roca"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Correspondencia entre sonidos y grafías","estrategia":"Completar palabras","pista":"Aunque el sonido inicial sea fuerte, coloca una sola r.","grupo":"primer-grupo","orden_grupo":11,"orden":77}}',
    1);

-- 78. La p baja del renglón
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La p baja del renglón' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La p baja del renglón',
    'Copia las letras. Deja que el palito de cada p minúscula baje del renglón.',
    'Legibilidad',
    '{"texto_guia":"P p P p","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["P p P p"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"trazo","nivel":1,"habilidad":"Forma y tamaño de la letra","estrategia":"Copia de modelo","pista":"En la p minúscula, la pancita queda a la derecha del palito.","grupo":"primer-grupo","orden_grupo":12,"orden":78}}',
    1);

-- 79. Une las sílabas con p
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Une las sílabas con p' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Une las sílabas con p',
    'Une los pedacitos de cada renglón y escribe las palabras completas.',
    'Ortografía',
    '{"texto_guia":"pa + lo\npe + pi + no\npi + no + le","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["palo pepino pinole"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"omision_adicion","nivel":2,"habilidad":"Conciencia silábica","estrategia":"Unión de sílabas","pista":"Cada palabra empieza con p. Revisa que no falte ninguna sílaba.","grupo":"primer-grupo","orden_grupo":13,"orden":79}}',
    1);

-- 80. Palabras que empiezan con n
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Palabras que empiezan con n' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Palabras que empiezan con n',
    'Completa con n y escribe cada palabra completa.',
    'Ortografía',
    '{"texto_guia":"_ido   _ota   _udo","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["nido nota nudo"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Correspondencia entre sonidos y grafías","estrategia":"Completar palabras","pista":"Toca la parte de arriba de la boca con la lengua al decir n.","grupo":"primer-grupo","orden_grupo":14,"orden":80}}',
    1);

-- 81. La n al final
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La n al final' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La n al final',
    'Copia las palabras. Revisa que todas terminen con n.',
    'Ortografía',
    '{"texto_guia":"atún melón listón","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["atún melón listón"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Reconocimiento de grafías en palabras","estrategia":"Copia de modelo","pista":"Lee despacio la última sílaba y conserva las tildes del modelo.","grupo":"primer-grupo","orden_grupo":15,"orden":81}}',
    1);

-- 82. Ca, co y cu al inicio
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Ca, co y cu al inicio' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Ca, co y cu al inicio',
    'Copia las palabras y di sus primeras sílabas en voz alta.',
    'Ortografía',
    '{"texto_guia":"capa coco cubo","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["capa coco cubo"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Reconocimiento de grafías en palabras","estrategia":"Copia de modelo","pista":"Con a, o y u, la c de estas palabras tiene el mismo sonido.","grupo":"primer-grupo","orden_grupo":16,"orden":82}}',
    1);

-- 83. Completa con c antes de a, o y u
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Completa con c antes de a, o y u' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Completa con c antes de a, o y u',
    'Agrega la c que falta y escribe las palabras completas.',
    'Ortografía',
    '{"texto_guia":"_amisa   _olador   _uadro","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["camisa colador cuadro"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Correspondencia entre sonidos y grafías","estrategia":"Completar palabras","pista":"Fíjate en la vocal que viene después de cada c.","grupo":"primer-grupo","orden_grupo":17,"orden":83}}',
    1);

-- 84. Palabras que empiezan con d
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Palabras que empiezan con d' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Palabras que empiezan con d',
    'Completa cada palabra con d. Escribe también la tilde que ves.',
    'Ortografía',
    '{"texto_guia":"_una   _iente   _ólar","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["duna diente dólar"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Correspondencia entre sonidos y grafías","estrategia":"Completar palabras","pista":"La pancita de la d queda a la izquierda del palito.","grupo":"primer-grupo","orden_grupo":18,"orden":84}}',
    1);

-- 85. Palabras que empiezan con v
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Palabras que empiezan con v' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Palabras que empiezan con v',
    'Agrega la v que falta y escribe las tres palabras completas.',
    'Ortografía',
    '{"texto_guia":"_aso   _estido   _iento","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["vaso vestido viento"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Correspondencia entre sonidos y grafías","estrategia":"Completar palabras","pista":"Dibuja dos rayas inclinadas que se juntan abajo para formar la v.","grupo":"primer-grupo","orden_grupo":19,"orden":85}}',
    1);

-- 86. Completa con f
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Completa con f' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Completa con f',
    'Escribe las palabras completas con f en el hueco.',
    'Ortografía',
    '{"texto_guia":"_oco   _alda   _ila","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["foco falda fila"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Correspondencia entre sonidos y grafías","estrategia":"Completar palabras","pista":"Al decir f, el aire sale entre los dientes de arriba y el labio de abajo.","grupo":"segundo-grupo","orden_grupo":5,"orden":86}}',
    1);

-- 87. Una r suave entre vocales
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Una r suave entre vocales' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Una r suave entre vocales',
    'Copia las palabras y di despacio la parte donde aparece la r.',
    'Ortografía',
    '{"texto_guia":"pera cara loro","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["pera cara loro"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Reconocimiento de grafías en palabras","estrategia":"Copia de modelo","pista":"En estas palabras, la r entre vocales suena suave y se escribe una vez.","grupo":"segundo-grupo","orden_grupo":6,"orden":87}}',
    1);

-- 88. Observa ge, gi, je y ji
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Observa ge, gi, je y ji' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Observa ge, gi, je y ji',
    'Copia las cuatro palabras. Revisa si cada una lleva g o j.',
    'Ortografía',
    '{"texto_guia":"gel girasol jefe jirafa","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["gel girasol jefe jirafa"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Reconocimiento de grafías en palabras","estrategia":"Copia de modelo","pista":"En estas palabras la g ante e o i suena como j. Fíjate en cómo se escribe cada una.","grupo":"segundo-grupo","orden_grupo":7,"orden":88}}',
    1);

-- 89. Completa con ch
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Completa con ch' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Completa con ch',
    'Escribe cada palabra completa colocando ch en el hueco.',
    'Ortografía',
    '{"texto_guia":"__ile   __aleco   __icle","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["chile chaleco chicle"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Correspondencia entre sonidos y grafías","estrategia":"Completar palabras","pista":"La c y la h se escriben juntas para representar el sonido de ch.","grupo":"segundo-grupo","orden_grupo":18,"orden":89}}',
    1);

-- 90. La ñ dentro de las palabras
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La ñ dentro de las palabras' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La ñ dentro de las palabras',
    'Agrega la ñ y escribe cada palabra completa.',
    'Ortografía',
    '{"texto_guia":"ba_o   mo_o   oto_o","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["baño moño otoño"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Correspondencia entre sonidos y grafías","estrategia":"Completar palabras","pista":"La rayita ondulada distingue la ñ de la n.","grupo":"segundo-grupo","orden_grupo":19,"orden":90}}',
    1);

-- 91. La k en mayúscula y minúscula
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La k en mayúscula y minúscula' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La k en mayúscula y minúscula',
    'Copia las cuatro letras tal como aparecen.',
    'Legibilidad',
    '{"texto_guia":"K k k K","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["K k k K"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"trazo","nivel":1,"habilidad":"Forma y tamaño de la letra","estrategia":"Copia de modelo","pista":"Cada k tiene un palito y dos rayas inclinadas.","grupo":"tercer-grupo","orden_grupo":2,"orden":91}}',
    1);

-- 92. Tres palabras con k
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Tres palabras con k' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Tres palabras con k',
    'Copia las tres palabras y localiza la k de cada una.',
    'Ortografía',
    '{"texto_guia":"koala kayak karate","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["koala kayak karate"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Reconocimiento de grafías en palabras","estrategia":"Copia de modelo","pista":"Busca la k tanto al inicio como dentro de las palabras.","grupo":"tercer-grupo","orden_grupo":3,"orden":92}}',
    1);

-- 93. Completa con k
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Completa con k' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Completa con k',
    'Escribe las palabras completas. Coloca una k donde falta la letra.',
    'Ortografía',
    '{"texto_guia":"_ilo   _iosco   _ilómetro","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["kilo kiosco kilómetro"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Correspondencia entre sonidos y grafías","estrategia":"Completar palabras","pista":"Las tres palabras empiezan con k. Conserva la tilde del modelo.","grupo":"tercer-grupo","orden_grupo":4,"orden":93}}',
    1);

-- 94. Que y qui en palabras
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Que y qui en palabras' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Que y qui en palabras',
    'Copia las palabras. Revisa que la q siempre esté acompañada por la u.',
    'Ortografía',
    '{"texto_guia":"querido quince quinto","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["querido quince quinto"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Reconocimiento de grafías en palabras","estrategia":"Copia de modelo","pista":"En que y qui escribimos u, aunque no se pronuncie.","grupo":"tercer-grupo","orden_grupo":5,"orden":94}}',
    1);

-- 95. Recupera el grupo qu
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Recupera el grupo qu' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Recupera el grupo qu',
    'Agrega qu en cada hueco. Escribe las palabras completas.',
    'Ortografía',
    '{"texto_guia":"__inceañera   mos__ito   es__ina","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["quinceañera mosquito esquina"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Correspondencia entre sonidos y grafías","estrategia":"Completar palabras","pista":"Copia las dos letras juntas y di la palabra para revisar si quedó completa.","grupo":"tercer-grupo","orden_grupo":6,"orden":95}}',
    1);

-- 96. Za, zo y zu
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Za, zo y zu' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Za, zo y zu',
    'Copia estas palabras y señala la sílaba que lleva z.',
    'Ortografía',
    '{"texto_guia":"zarpa zorro zumbido","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["zarpa zorro zumbido"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Reconocimiento de grafías en palabras","estrategia":"Copia de modelo","pista":"Mira qué vocal aparece después de cada z.","grupo":"tercer-grupo","orden_grupo":14,"orden":96}}',
    1);

-- 97. Palabras que terminan con z
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Palabras que terminan con z' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Palabras que terminan con z',
    'Completa con z y escribe las tres palabras completas.',
    'Ortografía',
    '{"texto_guia":"lu_   nue_   pe_","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["luz nuez pez"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Correspondencia entre sonidos y grafías","estrategia":"Completar palabras","pista":"Las tres palabras terminan con la misma letra.","grupo":"tercer-grupo","orden_grupo":15,"orden":97}}',
    1);

-- 98. La x dentro de las palabras
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La x dentro de las palabras' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La x dentro de las palabras',
    'Copia las palabras y encuentra la x de cada una.',
    'Ortografía',
    '{"texto_guia":"taxi boxeo texto","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["taxi boxeo texto"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Reconocimiento de grafías en palabras","estrategia":"Copia de modelo","pista":"En estas palabras puedes pronunciar la x como dos sonidos juntos: k y s.","grupo":"tercer-grupo","orden_grupo":16,"orden":98}}',
    1);

-- 99. Nombres de lugares con x
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Nombres de lugares con x' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Nombres de lugares con x',
    'Escribe los dos nombres completos con x. Conserva mayúsculas y tildes.',
    'Ortografía',
    '{"texto_guia":"Mé_ico   Oa_aca","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["México Oaxaca"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Correspondencia entre sonidos y grafías","estrategia":"Completar palabras","pista":"En estos dos nombres se escribe x, aunque suene como j.","grupo":"tercer-grupo","orden_grupo":17,"orden":99}}',
    1);

-- 100. La x al principio
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La x al principio' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La x al principio',
    'Copia las dos palabras y observa cómo empiezan.',
    'Ortografía',
    '{"texto_guia":"xilófono xilografía","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["xilófono xilografía"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":1,"habilidad":"Reconocimiento de grafías en palabras","estrategia":"Copia de modelo","pista":"En estas palabras, la x inicial se suele pronunciar como s.","grupo":"tercer-grupo","orden_grupo":18,"orden":100}}',
    1);

-- 101. La w en mayúscula y minúscula
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'La w en mayúscula y minúscula' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'La w en mayúscula y minúscula',
    'Copia las letras en el mismo orden.',
    'Legibilidad',
    '{"texto_guia":"W w W w","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["W w W w"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"trazo","nivel":1,"habilidad":"Forma y tamaño de la letra","estrategia":"Copia de modelo","pista":"Observa las dos puntas de abajo y la diferencia de tamaño.","grupo":"tercer-grupo","orden_grupo":19,"orden":101}}',
    1);

-- 102. Palabras que empiezan con w
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Palabras que empiezan con w' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Palabras que empiezan con w',
    'Agrega w al principio y escribe las palabras completas.',
    'Ortografía',
    '{"texto_guia":"_eb   _afle   _ombat","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["web wafle wombat"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Correspondencia entre sonidos y grafías","estrategia":"Completar palabras","pista":"Web es un término de internet, wafle es un alimento y wombat es un animal.","grupo":"tercer-grupo","orden_grupo":20,"orden":102}}',
    1);

-- 103. Palabras con br
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Palabras con br' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Palabras con br',
    'Copia las tres palabras y fíjate en las dos consonantes iniciales.',
    'Ortografía',
    '{"texto_guia":"brazo brisa brocha","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["brazo brisa brocha"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Escritura de sílabas trabadas","estrategia":"Copia de modelo","pista":"Lee bra, bri y bro de un solo golpe de voz.","grupo":"avanzado","orden_grupo":1,"orden":103}}',
    1);

-- 104. Completa con bl
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Completa con bl' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Completa con bl',
    'Agrega bl en los espacios y escribe las palabras completas.',
    'Ortografía',
    '{"texto_guia":"__oque   __usa   __ando","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["bloque blusa blando"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Escritura de sílabas trabadas","estrategia":"Completar palabras","pista":"Mantén la b y la l juntas antes de la vocal.","grupo":"avanzado","orden_grupo":2,"orden":104}}',
    1);

-- 105. Arma palabras con tr
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Arma palabras con tr' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Arma palabras con tr',
    'Junta los pedacitos de cada renglón y escribe las palabras completas.',
    'Ortografía',
    '{"texto_guia":"tro + fe + o\ntri + ci + clo\ntrue + no","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["trofeo triciclo trueno"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"omision_adicion","nivel":2,"habilidad":"Escritura de sílabas trabadas","estrategia":"Unión de sílabas","pista":"El grupo tr va junto en la primera sílaba.","grupo":"avanzado","orden_grupo":3,"orden":105}}',
    1);

-- 106. Palabras con dr
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Palabras con dr' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Palabras con dr',
    'Copia las palabras. Revisa dónde aparece dr en cada una.',
    'Ortografía',
    '{"texto_guia":"dragón ladrillo dromedario","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["dragón ladrillo dromedario"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Escritura de sílabas trabadas","estrategia":"Copia de modelo","pista":"Dr puede aparecer al comienzo o dentro de una palabra.","grupo":"avanzado","orden_grupo":4,"orden":106}}',
    1);

-- 107. Completa con fr
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Completa con fr' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Completa con fr',
    'Escribe las palabras completas colocando fr en los espacios.',
    'Ortografía',
    '{"texto_guia":"__uta   __esa   __asco","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["fruta fresa frasco"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Escritura de sílabas trabadas","estrategia":"Completar palabras","pista":"Di fru, fre y fra sin agregar una vocal entre f y r.","grupo":"avanzado","orden_grupo":5,"orden":107}}',
    1);

-- 108. Palabras con fl
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Palabras con fl' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Palabras con fl',
    'Copia las palabras y revisa que la f vaya seguida de l.',
    'Ortografía',
    '{"texto_guia":"flauta flecha flamenco","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["flauta flecha flamenco"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Escritura de sílabas trabadas","estrategia":"Copia de modelo","pista":"Di la primera sílaba completa y fíjate en la l antes de la vocal.","grupo":"avanzado","orden_grupo":6,"orden":108}}',
    1);

-- 109. Completa con cr
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Completa con cr' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Completa con cr',
    'Agrega cr y escribe las palabras completas. Conserva la tilde.',
    'Ortografía',
    '{"texto_guia":"__ema   __áter   __uce","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["crema cráter cruce"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Escritura de sílabas trabadas","estrategia":"Completar palabras","pista":"Para escribir cr, coloca la c antes de la r.","grupo":"avanzado","orden_grupo":7,"orden":109}}',
    1);

-- 110. Forma palabras con cl
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Forma palabras con cl' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Forma palabras con cl',
    'Une los pedacitos de cada renglón y escribe las palabras completas.',
    'Ortografía',
    '{"texto_guia":"cla + vo\ncli + ma\ncla + se","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["clavo clima clase"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"omision_adicion","nivel":2,"habilidad":"Escritura de sílabas trabadas","estrategia":"Unión de sílabas","pista":"La c y la l se quedan juntas cuando unes los pedacitos.","grupo":"avanzado","orden_grupo":8,"orden":110}}',
    1);

-- 111. Palabras con gr
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Palabras con gr' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Palabras con gr',
    'Copia las palabras y di la primera sílaba de cada una.',
    'Ortografía',
    '{"texto_guia":"grillo grúa granizo","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["grillo grúa granizo"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Escritura de sílabas trabadas","estrategia":"Copia de modelo","pista":"Escribe la g y la r juntas. Revisa la tilde de grúa.","grupo":"avanzado","orden_grupo":9,"orden":111}}',
    1);

-- 112. Completa con gl
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Completa con gl' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Completa con gl',
    'Coloca gl en cada espacio y escribe las palabras completas.',
    'Ortografía',
    '{"texto_guia":"__aciar   re__a   i__esia","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["glaciar regla iglesia"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Escritura de sílabas trabadas","estrategia":"Completar palabras","pista":"En algunas palabras gl va al inicio y en otras va en medio.","grupo":"avanzado","orden_grupo":10,"orden":112}}',
    1);

-- 113. Palabras con pr
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Palabras con pr' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Palabras con pr',
    'Copia las palabras con sus dos consonantes iniciales.',
    'Ortografía',
    '{"texto_guia":"premio prado prisa","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["premio prado prisa"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Escritura de sílabas trabadas","estrategia":"Copia de modelo","pista":"Pronuncia pre, pra y pri sin separar la p de la r.","grupo":"avanzado","orden_grupo":11,"orden":113}}',
    1);

-- 114. Completa con pl
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Completa con pl' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Completa con pl',
    'Coloca pl en los huecos y escribe las palabras completas.',
    'Ortografía',
    '{"texto_guia":"__uma   __átano   __aneta","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["pluma plátano planeta"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":2,"habilidad":"Escritura de sílabas trabadas","estrategia":"Completar palabras","pista":"Busca la l justo después de la p y conserva la tilde.","grupo":"avanzado","orden_grupo":12,"orden":114}}',
    1);

-- 115. Br y bl en una oración
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Br y bl en una oración' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Br y bl en una oración',
    'Copia la oración. Localiza bl y br en palabras diferentes.',
    'Ortografía',
    '{"texto_guia":"Blanca abre un libro.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["Blanca abre un libro."]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":3,"habilidad":"Escritura de sílabas trabadas","estrategia":"Copia de modelo","pista":"La primera palabra empieza con mayúscula. En abre y libro, la r sigue a la b.","grupo":"avanzado","orden_grupo":13,"orden":115}}',
    1);

-- 116. Elige entre tr y dr
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Elige entre tr y dr' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Elige entre tr y dr',
    'Usa tr o dr para completar las dos palabras. Escribe solo las palabras completas.',
    'Ortografía',
    '{"texto_guia":"Animal con escamas: coco__ilo\nFigura de tres lados: __iángulo","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["cocodrilo triángulo"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":3,"habilidad":"Escritura de sílabas trabadas","estrategia":"Completar palabras","pista":"Di las palabras y compara la primera consonante de dri y tri.","grupo":"avanzado","orden_grupo":14,"orden":116}}',
    1);

-- 117. Fr y fl en una oración
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Fr y fl en una oración' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Fr y fl en una oración',
    'Copia la oración y revisa la primera sílaba de frijol y de flota.',
    'Ortografía',
    '{"texto_guia":"El frijol flota.","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"copia","respuestas_aceptadas":["El frijol flota."]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":3,"habilidad":"Escritura de sílabas trabadas","estrategia":"Copia de modelo","pista":"La primera palabra del par lleva r después de f. La segunda lleva l.","grupo":"avanzado","orden_grupo":15,"orden":117}}',
    1);

-- 118. Elige entre cr y cl
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Elige entre cr y cl' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Elige entre cr y cl',
    'Completa cada palabra con cr o cl. Escribe solo las dos palabras completas.',
    'Ortografía',
    '{"texto_guia":"Sirve para colorear: __ayón\nFlor de tallo largo: __avel","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["crayón clavel"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":3,"habilidad":"Escritura de sílabas trabadas","estrategia":"Completar palabras","pista":"Lee ambas opciones y conserva la tilde de crayón.","grupo":"avanzado","orden_grupo":16,"orden":118}}',
    1);

-- 119. Elige entre gr y gl
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Elige entre gr y gl' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Elige entre gr y gl',
    'Completa con gr o gl según la pista. Escribe solo las palabras completas.',
    'Ortografía',
    '{"texto_guia":"Contrario de delgado: __ueso\nQue come mucho: __otón","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["grueso glotón"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":3,"habilidad":"Escritura de sílabas trabadas","estrategia":"Completar palabras","pista":"Después de la g, escucha si viene una r o una l.","grupo":"avanzado","orden_grupo":17,"orden":119}}',
    1);

-- 120. Elige entre pr y pl
IF NOT EXISTS (SELECT 1 FROM dbo.Ejercicios WHERE titulo = 'Elige entre pr y pl' AND id_tutor_creador IS NULL)
INSERT INTO dbo.Ejercicios (titulo, descripcion, tipo, contenido_base, id_estatus) VALUES (
    'Elige entre pr y pl',
    'Escribe las palabras completas usando pr o pl en el espacio.',
    'Ortografía',
    '{"texto_guia":"Persona con la que compartes abuelos: __imo\nObjeto musical redondo de metal: __atillo","imagen_guia":null,"imagen_en_lienzo":false,"evaluacion":{"modo":"completar","respuestas_aceptadas":["primo platillo"]},"pedagogia":{"metodo":"sintetico","error_objetivo":"grafias_dudosas","nivel":3,"habilidad":"Escritura de sílabas trabadas","estrategia":"Completar palabras","pista":"Compara las sílabas pri y pla antes de escribir.","grupo":"avanzado","orden_grupo":18,"orden":120}}',
    1);
GO
