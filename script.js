const regionByComuna = {
  'Región de Arica y Parinacota': ['Arica', 'Putre', 'Camarones'],
  'Región de Tarapacá': ['Iquique', 'Alto Hospicio', 'Pozo Almonte'],
  'Región de Antofagasta': ['Antofagasta', 'Calama', 'Taltal'],
  'Región de Atacama': ['Copiapó', 'Vallenar', 'Caldera'],
  'Región de Coquimbo': ['La Serena', 'Coquimbo', 'Ovalle'],
  'Región de Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué'],
  'Región Metropolitana': ['Santiago', 'Puente Alto', 'Las Condes'],
  'Región del Libertador General Bernardo O’Higgins': ['Rancagua', 'San Fernando', 'Machalí'],
  'Región del Maule': ['Talca', 'Curicó', 'Linares'],
  'Región de Ñuble': ['Chillán', 'Bulnes', 'San Carlos'],
  'Región del Biobío': ['Concepción', 'Los Ángeles', 'Talcahuano'],
  'Región de La Araucanía': ['Temuco', 'Padre Las Casas', 'Angol'],
  'Región de Los Lagos': ['Puerto Montt', 'Osorno', 'Castro'],
  'Región de Aysén': ['Coyhaique', 'Puerto Aysén', 'Villa O’Higgins'],
  'Región de Magallanes y de la Antártica Chilena': ['Punta Arenas', 'Puerto Natales', 'Porvenir']
};

const volunteerSeed = [
  { nombre: 'María', apellidos: 'Pérez', documento: '12.345.678-9', email: 'maria.perez@correo.cl', telefono: '+56 9 1234 5678', region: 'Región Metropolitana', comuna: 'Santiago', direccion: 'Av. Brasil 123' },
  { nombre: 'Ignacio', apellidos: 'López', documento: '18.654.321-0', email: 'ignacio.lopez@correo.cl', telefono: '+56 9 8765 4321', region: 'Región de Valparaíso', comuna: 'Viña del Mar', direccion: 'Calle Los Pinos 55' },
  { nombre: 'Sofía', apellidos: 'García', documento: '20.112.233-4', email: 'sofia.garcia@correo.cl', telefono: '+56 9 4321 8765', region: 'Región del Biobío', comuna: 'Concepción', direccion: 'Pedro de Valdivia 202' },
  { nombre: 'Diego', apellidos: 'Muñoz', documento: '21.223.344-5', email: 'diego.munoz@correo.cl', telefono: '+56 9 3344 5566', region: 'Región de Los Lagos', comuna: 'Puerto Montt', direccion: 'Av. Costera 88' }
];

const sightingSeed = [
  { tipo: 'Pájaro', nombre: 'Huairavo', nombreCientifico: 'Larus dominicanus', fecha: '2026-09-20', hora: '08:40', region: 'Región Metropolitana', comuna: 'Santiago', lugar: 'Parque Forestal', descripcion: 'Grupo de 6 ejemplares en árbol cercano a laguna.', voluntario: 'María Pérez' },
  { tipo: 'Ave marina', nombre: 'Gaviota dominicana', nombreCientifico: 'Larus dominicanus', fecha: '2026-09-16', hora: '18:05', region: 'Región de Valparaíso', comuna: 'Viña del Mar', lugar: 'Playa Las Salinas', descripcion: 'Actividad de alimentación entre las rocas.', voluntario: 'Ignacio López' },
  { tipo: 'Rapaz', nombre: 'Cóndor', nombreCientifico: 'Vultur gryphus', fecha: '2026-08-28', hora: '14:20', region: 'Región de Coquimbo', comuna: 'La Serena', lugar: 'Monte Los Pinos', descripcion: 'Avistamiento de ejemplar solo en vuelo.', voluntario: 'Sofía García' },
  { tipo: 'Ave de humedal', nombre: 'Tagua', nombreCientifico: 'Fulica armillata', fecha: '2026-09-10', hora: '06:15', region: 'Región del Biobío', comuna: 'Concepción', lugar: 'Laguna de Lenga', descripcion: 'Nido y varias parejas en el humedal.', voluntario: 'Diego Muñoz' },
  { tipo: 'Pájaro', nombre: 'Diuca', nombreCientifico: 'Diuca diuca', fecha: '2026-07-22', hora: '09:30', region: 'Región de Ñuble', comuna: 'Chillán', lugar: 'Campus universitario', descripcion: 'Varios ejemplares en campo abierto.', voluntario: 'María Pérez' },
  { tipo: 'Ave costera', nombre: 'Chorlo', nombreCientifico: 'Charadrius modestus', fecha: '2026-09-04', hora: '17:10', region: 'Región de Los Lagos', comuna: 'Puerto Montt', lugar: 'Ribera del río', descripcion: 'Se observó cerca de la marea baja.', voluntario: 'Diego Muñoz' },
  { tipo: 'Otra', nombre: 'Tiuque', nombreCientifico: 'Buteo albigula', fecha: '2026-06-18', hora: '12:55', region: 'Región de Antofagasta', comuna: 'Calama', lugar: 'Cerro de la zona norte', descripcion: 'Se observó planeando en térmicas.', voluntario: 'Ignacio López' },
  { tipo: 'Pájaro', nombre: 'Picaflor', nombreCientifico: 'Sephanoides sephaniodes', fecha: '2026-05-05', hora: '10:15', region: 'Región Metropolitana', comuna: 'Las Condes', lugar: 'Jardín botánico', descripcion: 'Dos individuos sobre flores.', voluntario: 'Sofía García' },
  { tipo: 'Ave marina', nombre: 'Albatros', nombreCientifico: 'Diomedea exulans', fecha: '2026-09-22', hora: '07:25', region: 'Región de Magallanes y de la Antártica Chilena', comuna: 'Punta Arenas', lugar: 'Puerto', descripcion: 'Apareció junto a embarcaciones pesqueras.', voluntario: 'María Pérez' },
  { tipo: 'Rapaz', nombre: 'Águila pescadora', nombreCientifico: 'Pandion haliaetus', fecha: '2026-09-12', hora: '15:35', region: 'Región de Tarapacá', comuna: 'Iquique', lugar: 'Costa de Alto Hospicio', descripcion: 'Sobrevoló la costa en busca de peces.', voluntario: 'Diego Muñoz' },
  { tipo: 'Ave de humedal', nombre: 'Ganzo', nombreCientifico: 'Chloephaga picta', fecha: '2026-08-14', hora: '06:50', region: 'Región del Maule', comuna: 'Talca', lugar: 'Bajo el puente', descripcion: 'Seis ejemplares junto al cauce.', voluntario: 'Ignacio López' },
  { tipo: 'Pájaro', nombre: 'Cortarrama', nombreCientifico: 'Bubo magellanicus', fecha: '2026-09-01', hora: '20:10', region: 'Región de La Araucanía', comuna: 'Temuco', lugar: 'Bosque cercano a carretera', descripcion: 'Actividad nocturna con canto claro.', voluntario: 'Sofía García' }
];

const regionNames = Object.keys(regionByComuna);

function initRegionSelects() {
  const regionSelects = [
    document.getElementById('region'),
    document.getElementById('regionObservacion')
  ];

  regionSelects.forEach((select) => {
    if (!select) return;
    regionNames.forEach((region) => {
      const option = document.createElement('option');
      option.value = region;
      option.textContent = region;
      select.appendChild(option);
    });
  });

  const volunteerRegion = document.getElementById('region');
  const observationRegion = document.getElementById('regionObservacion');

  if (volunteerRegion) {
    volunteerRegion.addEventListener('change', () => populateComunas('comuna', volunteerRegion.value));
  }

  if (observationRegion) {
    observationRegion.addEventListener('change', () => populateComunas('comunaObservacion', observationRegion.value));
  }
}

function populateComunas(selectId, regionValue) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = '<option value="">Seleccione una comuna</option>';
  if (!regionValue) return;

  const options = regionByComuna[regionValue] || [];
  options.forEach((comuna) => {
    const option = document.createElement('option');
    option.value = comuna;
    option.textContent = comuna;
    select.appendChild(option);
  });
}

function populateVolunteersSelect() {
  const select = document.getElementById('voluntario');
  if (!select) return;

  volunteerSeed.forEach((volunteer) => {
    const option = document.createElement('option');
    option.value = `${volunteer.nombre} ${volunteer.apellidos}`;
    option.textContent = `${volunteer.nombre} ${volunteer.apellidos}`;
    select.appendChild(option);
  });
}

function showMessage(elementId, message, type) {
  const messageBox = document.getElementById(elementId);
  if (!messageBox) return;
  messageBox.textContent = message;
  messageBox.className = `form-message ${type}`;
}

function validateVolunteerForm(event) {
  event.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const apellidos = document.getElementById('apellidos').value.trim();
  const documento = document.getElementById('documento').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const region = document.getElementById('region').value;
  const comuna = document.getElementById('comuna').value;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\+?56\s?9\s?\d{4}\s?\d{4}$/;
  const runPattern = /^\d{1,2}\.\d{3}\.\d{3}-[0-9kK]$/;

  if (!nombre || !apellidos || !documento || !email || !telefono || !region || !comuna) {
    showMessage('volunteerMessage', 'Debe completar todos los campos obligatorios.', 'error');
    return;
  }

  if (!runPattern.test(documento)) {
    showMessage('volunteerMessage', 'El RUN debe tener el formato 12.345.678-9.', 'error');
    return;
  }

  if (!emailPattern.test(email)) {
    showMessage('volunteerMessage', 'El correo electrónico no tiene un formato válido.', 'error');
    return;
  }

  if (!phonePattern.test(telefono)) {
    showMessage('volunteerMessage', 'El teléfono debe seguir el formato +56 9 1234 5678.', 'error');
    return;
  }

  showMessage('volunteerMessage', 'Voluntario registrado correctamente.', 'success');
  document.getElementById('volunteerForm').reset();
  document.getElementById('comuna').innerHTML = '<option value="">Primero seleccione región</option>';
}

function validateObservationForm(event) {
  event.preventDefault();

  const voluntario = document.getElementById('voluntario').value;
  const tipoAve = document.getElementById('tipoAve').value;
  const nombreAve = document.getElementById('nombreAve').value.trim();
  const fechaAvistamiento = document.getElementById('fechaAvistamiento').value;
  const horaAvistamiento = document.getElementById('horaAvistamiento').value;
  const region = document.getElementById('regionObservacion').value;
  const comuna = document.getElementById('comunaObservacion').value;
  const lugar = document.getElementById('lugar').value.trim();
  const archivo = document.getElementById('archivo').files.length;

  if (!voluntario || !tipoAve || !nombreAve || !fechaAvistamiento || !horaAvistamiento || !region || !comuna || !lugar || !archivo) {
    showMessage('observationMessage', 'Debe completar todos los campos requeridos y adjuntar al menos una foto o video.', 'error');
    return;
  }

  const selectedDate = new Date(`${fechaAvistamiento}T00:00:00`);
  const now = new Date();
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(now.getFullYear() - 5);

  if (selectedDate > now) {
    showMessage('observationMessage', 'La fecha del avistamiento no puede estar en el futuro.', 'error');
    return;
  }

  if (selectedDate < fiveYearsAgo) {
    showMessage('observationMessage', 'La fecha del avistamiento debe ser de los últimos cinco años.', 'error');
    return;
  }

  showMessage('observationMessage', 'Avistamiento registrado correctamente.', 'success');
  document.getElementById('observationForm').reset();
  document.getElementById('comunaObservacion').innerHTML = '<option value="">Primero seleccione región</option>';
}

function applyObservationFilters() {
  const selectedType = document.getElementById('filterType')?.value || 'all';
  const sortValue = document.getElementById('sortOrder')?.value || 'fecha-desc';
  const pageSizeValue = Number(document.getElementById('pageSize')?.value || 10);

  let filtered = [...sightingSeed];
  if (selectedType !== 'all') {
    filtered = filtered.filter((item) => item.tipo === selectedType);
  }

  if (sortValue === 'fecha-desc') {
    filtered.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  } else if (sortValue === 'fecha-asc') {
    filtered.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  } else if (sortValue === 'lugar-asc') {
    filtered.sort((a, b) => a.lugar.localeCompare(b.lugar));
  } else if (sortValue === 'lugar-desc') {
    filtered.sort((a, b) => b.lugar.localeCompare(a.lugar));
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSizeValue));
  const currentPage = Number(document.body.dataset.currentPage || 1);
  const safePage = Math.min(currentPage, totalPages);
  document.body.dataset.currentPage = String(safePage);

  const startIndex = (safePage - 1) * pageSizeValue;
  const pageData = filtered.slice(startIndex, startIndex + pageSizeValue);

  renderObservationTable(pageData);
  renderPagination(totalPages, safePage);
  const tableSummary = document.getElementById('tableSummary');
  if (tableSummary) {
    tableSummary.textContent = `Mostrando ${pageData.length} de ${filtered.length} registros`;
  }
}

function renderObservationTable(data) {
  const tbody = document.getElementById('observationsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!data.length) {
    tbody.innerHTML = '<tr><td colspan="7">No hay registros para los filtros seleccionados.</td></tr>';
    return;
  }

  data.forEach((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.tipo}</td>
      <td>${item.nombre}</td>
      <td>${formatDate(item.fecha)}</td>
      <td>${item.hora}</td>
      <td>${item.lugar}</td>
      <td>${item.region}</td>
      <td>${item.voluntario}</td>
    `;
    tbody.appendChild(row);
  });
}

function renderPagination(totalPages, currentPage) {
  const container = document.getElementById('pagination');
  if (!container) return;

  container.innerHTML = '';

  for (let page = 1; page <= totalPages; page += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `page-btn ${page === currentPage ? 'active' : ''}`;
    button.textContent = String(page);
    button.addEventListener('click', () => {
      document.body.dataset.currentPage = String(page);
      applyObservationFilters();
    });
    container.appendChild(button);
  }
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function renderDashboardSummary() {
  const summary = document.getElementById('dashboardSummary');
  if (!summary) return;

  const totalVoluntarios = volunteerSeed.length;
  const totalAvistamientos = sightingSeed.length;
  const especies = new Set(sightingSeed.map((item) => item.nombre)).size;
  const regionesConRegistros = new Set(sightingSeed.map((item) => item.region)).size;

  summary.innerHTML = `
    <article class="kpi-card">
      <div class="label">Voluntarios registrados</div>
      <div class="value">${totalVoluntarios}</div>
      <div class="trend">+12% vs. mes anterior</div>
    </article>
    <article class="kpi-card">
      <div class="label">Avistamientos</div>
      <div class="value">${totalAvistamientos}</div>
      <div class="trend">+8% vs. última quincena</div>
    </article>
    <article class="kpi-card">
      <div class="label">Especies observadas</div>
      <div class="value">${especies}</div>
      <div class="trend">6 nuevas reportadas</div>
    </article>
    <article class="kpi-card">
      <div class="label">Regiones activas</div>
      <div class="value">${regionesConRegistros}</div>
      <div class="trend">Monitoreo continuo</div>
    </article>
  `;
}

function renderBarChart() {
  const container = document.getElementById('barChart');
  if (!container) return;

  const counts = {};
  sightingSeed.forEach((item) => {
    counts[item.tipo] = (counts[item.tipo] || 0) + 1;
  });

  const maxValue = Math.max(...Object.values(counts));

  container.innerHTML = Object.entries(counts).map(([label, value]) => {
    const percentage = (value / maxValue) * 100;
    return `
      <div class="bar-row">
        <span class="bar-label">${label}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${percentage}%"></div></div>
        <strong>${value}</strong>
      </div>
    `;
  }).join('');
}

function renderDonutChart() {
  const container = document.getElementById('donutChart');
  if (!container) return;

  const counts = {};
  volunteerSeed.forEach((volunteer) => {
    counts[volunteer.region] = (counts[volunteer.region] || 0) + 1;
  });

  const colors = ['#1f5f53', '#d89d41', '#7eb4b0', '#9a8ef0', '#cb6e5f', '#7bc58a'];
  const entries = Object.entries(counts);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);

  let cumulative = 0;
  const gradient = entries.map(([region, value], index) => {
    const start = (cumulative / total) * 100;
    cumulative += value;
    const end = (cumulative / total) * 100;
    return `${colors[index % colors.length]} ${start}% ${end}%`;
  }).join(', ');

  const legend = entries.map(([region, value], index) => `
    <div class="legend-item">
      <span class="dot" style="background:${colors[index % colors.length]};"></span>
      <span>${region}: ${value}</span>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="donut-wrap">
      <div class="donut" style="background: conic-gradient(${gradient});"></div>
      <div class="donut-center">${total}</div>
    </div>
    <div class="legend">${legend}</div>
  `;
}

function initializeForms() {
  initRegionSelects();
  populateVolunteersSelect();

  const volunteerForm = document.getElementById('volunteerForm');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', validateVolunteerForm);
  }

  const observationForm = document.getElementById('observationForm');
  if (observationForm) {
    observationForm.addEventListener('submit', validateObservationForm);
  }
}

function initializeQueryPage() {
  document.body.dataset.currentPage = '1';

  const filterType = document.getElementById('filterType');
  const sortOrder = document.getElementById('sortOrder');
  const pageSize = document.getElementById('pageSize');

  [filterType, sortOrder, pageSize].forEach((element) => {
    if (element) {
      element.addEventListener('change', applyObservationFilters);
    }
  });

  applyObservationFilters();
}

function initializeDashboard() {
  renderDashboardSummary();
  renderBarChart();
  renderDonutChart();
}

document.addEventListener('DOMContentLoaded', () => {
  initializeForms();
  initializeQueryPage();
  initializeDashboard();
});
