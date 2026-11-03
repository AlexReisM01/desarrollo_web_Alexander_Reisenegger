# Sistema de avistamientos de aves

Aplicación web Flask para registrar voluntarios y avistamientos, consultar sus detalles y visualizar estadísticas de la base de datos.

## Preparación de la base de datos

1. Para una instalación nueva, cree la base de datos y cargue los datos de Tarea 2 según los scripts del proyecto. Si ya existe la base de datos de Tarea 2, no vuelva a ejecutar `tarea2.sql`, ya que elimina y recrea el esquema.
2. Ejecute `tabla-comentario.sql` para crear la tabla de comentarios.
3. Ejecute `migracion-tarea3.sql` una vez sobre la base de datos existente. Agrega la categoría del ave a cada avistamiento sin reemplazar los registros; los avistamientos antiguos reciben la categoría `Otra`.
4. Configure las credenciales de conexión de MySQL en `app.py` para su entorno local.

La aplicación se conecta a MySQL usando Flask, SQLAlchemy y `mysql-connector-python`. Instale esas dependencias en su entorno Python y ejecute `python app.py`.

## Datos de prueba

La base de datos local usada durante el desarrollo contiene datos ficticios para probar las funcionalidades de Tarea 3: 3 voluntarios, 6 avistamientos y 6 comentarios. Los voluntarios y lugares de prueba están identificados con `PRUEBA TAREA3`; los comentarios aparecen como `Comentarista prueba`. Estos registros se agregaron sin borrar los datos que ya existían.

Los datos se insertaron directamente en la base local y no forman parte de los scripts SQL de carga del repositorio. No se volverán a crear automáticamente al iniciar la aplicación.

## Decisiones de implementación

- Los comentarios se consultan y agregan de forma asíncrona con `fetch`. La validación se ejecuta en el navegador y nuevamente en Flask; el nombre permite entre 3 y 50 caracteres y el texto entre 5 y 300 caracteres.
- La categoría elegida al registrar un avistamiento se persiste en `avistamiento.tipo_ave`. Por ello, el gráfico circular cuenta los avistamientos por categoría (Pájaro, Ave marina, Rapaz, Ave de humedal, Ave costera y Otra), en lugar de agrupar por especie.
- La API `/api/estadisticas` obtiene desde MySQL los avistamientos por día, avistamientos por categoría y voluntarios por comuna. Los tres gráficos se dibujan en el navegador con Chart.js 4, biblioteca JavaScript de licencia MIT servida desde jsDelivr.
- El contenido de los comentarios se agrega al DOM como texto, no como HTML, para que entradas con marcado no se ejecuten.
