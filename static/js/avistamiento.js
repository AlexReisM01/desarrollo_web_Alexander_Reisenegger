document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('observationForm');
  if (!form) return;

  const regionSelect = document.getElementById('regionObservacion');
  const comunaSelect = document.getElementById('comunaObservacion');
  const messageBox = document.getElementById('observationMessage');
  const allComunas = Array.from(document.querySelectorAll('#comunaObservacion option[data-region-id]'));

  function showClientError(message) {
    if (messageBox) {
      messageBox.textContent = message;
      messageBox.className = 'form-message error';
    }
  }

  function validate() {
    const voluntario = document.getElementById('voluntario').value;
    const tipoAve = document.getElementById('tipoAve').value;
    const nombreAve = document.getElementById('nombreAve').value.trim();
    const fecha = document.getElementById('fechaAvistamiento').value;
    const hora = document.getElementById('horaAvistamiento').value;
    const region = regionSelect.value;
    const comuna = comunaSelect.value;
    const lugar = document.getElementById('lugar').value.trim();
    const files = document.getElementById('archivo').files;

    if (!voluntario || !tipoAve || !nombreAve || !fecha || !hora || !region || !comuna || !lugar || files.length === 0) {
      showClientError('Debe completar todos los campos obligatorios y adjuntar al menos una foto o video.');
      return false;
    }

    const selectedDate = new Date(`${fecha}T00:00:00`);
    const now = new Date();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(now.getFullYear() - 5);

    if (selectedDate > now) {
      showClientError('La fecha del avistamiento no puede estar en el futuro.');
      return false;
    }

    if (selectedDate < fiveYearsAgo) {
      showClientError('La fecha del avistamiento debe ser de los últimos cinco años.');
      return false;
    }

    const allowedTypes = ['image/', 'video/'];
    const invalid = Array.from(files).some((file) => {
      if (!file.type) return true;
      return !allowedTypes.some((type) => file.type.startsWith(type));
    });

    if (invalid) {
      showClientError('Solo se permiten archivos de imagen o video.');
      return false;
    }

    if (messageBox) {
      messageBox.textContent = '';
      messageBox.className = 'form-message';
    }
    return true;
  }

  regionSelect.addEventListener('change', () => {
    const regionId = regionSelect.value;
    comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
    if (!regionId) return;

    allComunas.forEach((option) => {
      if (option.dataset.regionId === regionId) {
        comunaSelect.appendChild(option.cloneNode(true));
      }
    });
  });

  form.addEventListener('submit', (event) => {
    if (!validate()) {
      event.preventDefault();
    }
  });
});
