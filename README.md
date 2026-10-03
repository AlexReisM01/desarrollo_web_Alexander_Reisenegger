# Tarea 1 - Sistema de avistamientos de aves

Este prototipo fue desarrollado como una interfaz estática en HTML5, CSS3 y JavaScript, sin uso de servidor web ni persistencia de datos, con el objetivo de validar la navegación, los formularios y las reglas de validación del sistema propuesto.

## Decisiones de diseño

- Se implementaron 5 páginas principales:
  - Inicio
  - Registro de voluntario
  - Registro de avistamiento
  - Consulta de avistamientos
  - Indicadores y métricas
- Se usaron etiquetas semánticas como `header`, `main`, `section`, `nav`, `form`, `table` y `footer` para mejorar la legibilidad del código y la accesibilidad.
- La validación se realiza completamente con JavaScript para cumplir con la exigencia de no depender de `required` como validación principal.
- Los formularios incluyen mensajes claros de error y éxito en pantalla.
- La estructura es responsive y funciona en distintas resoluciones mediante media queries.

## Validaciones implementadas

### Registro de voluntario
- Nombre y apellidos obligatorios.
- RUN con formato válido.
- Correo electrónico con formato válido.
- Teléfono móvil con formato válido.
- Región y comuna obligatorias.
- Se valida la presencia de datos requeridos y la estructura del contenido.

### Registro de avistamiento
- Voluntario reportante obligatorio.
- Tipo de ave, nombre, fecha, hora, región, comuna y lugar obligatorios.
- Se exige al menos un archivo de imagen o video.
- La fecha no puede estar en el futuro y debe corresponder a los últimos 5 años.
- Se validan los campos obligatorios y la consistencia temporal.

### Consulta de avistamientos
- Filtros por tipo de ave.
- Ordenamiento por fecha y lugar.
- Paginación con resultados por página.
- Tabla dinámica simulando registros del sistema.

### Indicadores
- Resumen con métricas clave.
- Gráfico de barras por tipo de ave.
- Gráfico circular por región de voluntarios.

## Cómo abrir el prototipo

Puedes abrir directamente cualquiera de los archivos `.html` en el navegador, por ejemplo:

- `index.html`

No es necesario iniciar un servidor ni instalar dependencias.

## Nota

Este es un prototipo de interfaz, por lo que los datos ingresados no se almacenan ni se persisten entre sesiones.
