document.addEventListener('DOMContentLoaded', async () => {
  const message = document.getElementById('statisticsMessage');
  try {
    const response = await fetch('/api/estadisticas');
    if (!response.ok) {
      throw new Error('No fue posible cargar las estadísticas.');
    }
    const data = await response.json();

    new Chart(document.getElementById('sightingsByDay'), {
      type: 'line',
      data: {
        labels: data.avistamientos_por_dia.map((item) => item.fecha),
        datasets: [{
          label: 'Avistamientos',
          data: data.avistamientos_por_dia.map((item) => item.total),
          borderColor: '#214f52',
          backgroundColor: 'rgba(33, 79, 82, 0.15)',
          tension: 0.25,
          fill: true
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    new Chart(document.getElementById('sightingsByType'), {
      type: 'pie',
      data: {
        labels: data.avistamientos_por_tipo.map((item) => item.tipo),
        datasets: [{
          data: data.avistamientos_por_tipo.map((item) => item.total),
          backgroundColor: ['#214f52', '#4b8580', '#78a99b', '#e7aa5b', '#c56b54', '#8d7aa8']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    new Chart(document.getElementById('volunteersByComuna'), {
      type: 'bar',
      data: {
        labels: data.voluntarios_por_comuna.map((item) => item.comuna),
        datasets: [{
          label: 'Voluntarios',
          data: data.voluntarios_por_comuna.map((item) => item.total),
          backgroundColor: '#4b8580'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });

    message.textContent = '';
  } catch (error) {
    message.textContent = error.message || 'Ocurrió un error al cargar las estadísticas.';
    message.className = 'form-message error';
  }
});
