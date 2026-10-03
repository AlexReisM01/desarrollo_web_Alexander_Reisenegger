document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('volunteerForm');
  if (!form) return;

  const regionSelect = document.getElementById('region');
  const comunaSelect = document.getElementById('comuna');
  const messageBox = document.getElementById('volunteerMessage');
  const allComunas = Array.from(document.querySelectorAll('#comuna option[data-region-id]'));

  function showClientError(message) {
    if (messageBox) {
      messageBox.textContent = message;
      messageBox.className = 'form-message error';
    }
  }

  function validate() {
    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const documento = document.getElementById('documento').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const region = regionSelect.value;
    const comuna = comunaSelect.value;

    if (!nombre || !apellidos || !documento || !email || !telefono || !region || !comuna) {
      showClientError('Debe completar todos los campos obligatorios antes de enviar.');
      return false;
    }

    const runPattern = /^\d{1,2}\.\d{3}\.\d{3}-[0-9kK]$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^(?:\+56\s?)?(?:9\s?\d{8})$/;

    if (!runPattern.test(documento)) {
      showClientError('El RUN debe tener el formato 12.345.678-9.');
      return false;
    }

    if (!emailPattern.test(email)) {
      showClientError('El correo electrónico tiene un formato inválido.');
      return false;
    }

    if (!phonePattern.test(telefono)) {
      showClientError('El teléfono debe tener formato chileno, por ejemplo +56 9 1234 5678.');
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
