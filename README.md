# Sistema de avistamientos de aves

Aplicación web para registrar voluntarios y avistamientos, consultar detalles y visualizar estadísticas.

## Aplicación anterior (Flask)

La aplicación original continúa disponible con Flask, SQLAlchemy y MySQL Connector. Instale las dependencias Python del entorno y ejecute `python app.py`.

## Buscador y evaluación (Spring Boot)

El módulo `springboot/` implementa el buscador asíncrono y la evaluación de avistamientos con Java 17+, Spring Boot, Spring Data JPA y MySQL.

1. Cree/cargue el esquema `tarea2` según los scripts del proyecto. No vuelva a ejecutar `tarea2.sql` sobre una base de datos existente, porque elimina y recrea el esquema.
2. Ejecute `tabla-comentario.sql` y `migracion-tarea3.sql` si aún no lo ha hecho.
3. Ejecute `tabla-nota.sql` para crear la tabla de evaluaciones.
4. Configure `DB_URL`, `DB_USERNAME` y `DB_PASSWORD` (por defecto, la conexión local `tarea2` con el usuario `cc5002`).
5. Desde `springboot/`, ejecute `mvn spring-boot:run` y abra `http://localhost:8080`.

La página realiza las búsquedas y envía las evaluaciones con `fetch`. La nota mostrada es el promedio de las evaluaciones guardadas; las evaluaciones aceptadas son enteros entre 1 y 7, validados tanto en Spring Boot como en el cliente.


## Decisiones de implementación

- Los comentarios se consultan y agregan de forma asíncrona con `fetch`. La validación se ejecuta en el navegador y nuevamente en Flask; el nombre permite entre 3 y 50 caracteres y el texto entre 5 y 300 caracteres.
- La categoría elegida al registrar un avistamiento se persiste en `avistamiento.tipo_ave`. Por ello, el gráfico circular cuenta los avistamientos por categoría (Pájaro, Ave marina, Rapaz, Ave de humedal, Ave costera y Otra), en lugar de agrupar por especie.
- La API `/api/estadisticas` obtiene desde MySQL los avistamientos por día, avistamientos por categoría y voluntarios por comuna. Los tres gráficos se dibujan en el navegador con Chart.js 4, biblioteca JavaScript de licencia MIT servida desde jsDelivr.
- El contenido de los comentarios se agrega al DOM como texto, no como HTML, para que entradas con marcado no se ejecuten.
