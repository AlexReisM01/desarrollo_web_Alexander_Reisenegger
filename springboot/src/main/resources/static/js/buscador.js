document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');
  const status = document.getElementById('search-status');
  const resultsWrap = document.getElementById('results-wrap');
  const results = document.getElementById('results');
  let debounceTimer;
  let activeSearch;

  form.addEventListener('submit', (event) => event.preventDefault());

  function fold(value) {
    let text = '';
    const positions = [];
    let sourceIndex = 0;
    for (const character of value) {
      const folded = character.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
      text += folded;
      for (let index = 0; index < folded.length; index += 1) {
        positions.push(sourceIndex);
      }
      sourceIndex += character.length;
    }
    return { text, positions };
  }

  function appendHighlighted(cell, value, query) {
    const foldedValue = fold(value);
    const foldedQuery = fold(query).text;
    const matchIndex = foldedValue.text.indexOf(foldedQuery);
    if (matchIndex === -1 || foldedQuery.length === 0) {
      cell.textContent = value;
      return;
    }

    const start = foldedValue.positions[matchIndex];
    const end = foldedValue.positions[matchIndex + foldedQuery.length - 1] + 1;
    cell.append(document.createTextNode(value.slice(0, start)));
    const mark = document.createElement('mark');
    mark.textContent = value.slice(start, end);
    cell.append(mark, document.createTextNode(value.slice(end)));
  }

  function formatDate(value) {
    return value.slice(0, 10).split('-').reverse().join('-');
  }

  function formatAverage(value) {
    return value === null ? '-' : Number(value).toFixed(2);
  }

  function createCell(row, value, query, highlight = true) {
    const cell = document.createElement('td');
    if (highlight) {
      appendHighlighted(cell, value, query);
    } else {
      cell.textContent = value;
    }
    row.append(cell);
    return cell;
  }

  function renderItems(items, query) {
    results.replaceChildren();
    resultsWrap.hidden = items.length === 0;

    for (const item of items) {
      const row = document.createElement('tr');
      row.dataset.id = item.id;
      createCell(row, item.voluntario, query);
      createCell(row, formatDate(item.fechaHora), query, false);
      createCell(row, item.ave, query);
      createCell(row, item.comuna, query);
      const averageCell = createCell(row, formatAverage(item.promedio), query, false);
      averageCell.classList.add('average');
      const actionCell = document.createElement('td');
      const evaluateButton = document.createElement('button');
      evaluateButton.type = 'button';
      evaluateButton.className = 'evaluate-button';
      evaluateButton.textContent = 'Evaluar';
      evaluateButton.addEventListener('click', () => evaluate(item.id, averageCell, evaluateButton));
      actionCell.append(evaluateButton);
      row.append(actionCell);
      results.append(row);
    }
  }

  async function search(query) {
    if (activeSearch) activeSearch.abort();
    activeSearch = new AbortController();
    status.textContent = 'Buscando...';
    resultsWrap.hidden = true;
    results.replaceChildren();

    try {
      const response = await fetch(`/api/avistamientos?q=${encodeURIComponent(query)}`, {
        signal: activeSearch.signal
      });
      if (!response.ok) {
        throw new Error('No fue posible buscar los avistamientos.');
      }
      const items = await response.json();
      renderItems(items, query);
      status.textContent = items.length === 0
        ? 'No se encontraron avistamientos para esa búsqueda.'
        : `Se encontraron ${items.length} avistamiento(s).`;
    } catch (error) {
      if (error.name !== 'AbortError') {
        status.textContent = error.message || 'Ocurrió un error al buscar.';
      }
    }
  }

  async function evaluate(id, averageCell, button) {
    const value = window.prompt('Ingresa una nota entera entre 1 y 7:');
    if (value === null) return;
    if (!/^[1-7]$/.test(value.trim())) {
      window.alert('La nota debe ser un número entero entre 1 y 7.');
      return;
    }

    button.disabled = true;
    try {
      const response = await fetch(`/api/avistamientos/${id}/notas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nota: Number(value.trim()) })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'No fue posible guardar la nota.');
      }
      averageCell.textContent = formatAverage(result.promedio);
      status.textContent = 'La nota se guardó y se actualizó el promedio.';
    } catch (error) {
      status.textContent = error.message || 'Ocurrió un error al guardar la nota.';
    } finally {
      button.disabled = false;
    }
  }

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = input.value.trim();
    if (activeSearch) activeSearch.abort();
    if (!query) {
      results.replaceChildren();
      resultsWrap.hidden = true;
      status.textContent = 'Escribe para buscar avistamientos.';
      return;
    }
    debounceTimer = window.setTimeout(() => search(query), 250);
  });
});
