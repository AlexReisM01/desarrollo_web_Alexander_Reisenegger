document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('commentsList');
  const form = document.getElementById('commentForm');
  const message = document.getElementById('commentsMessage');
  const submitButton = document.getElementById('commentSubmit');
  if (!list || !form || !message || !submitButton) return;

  const commentsUrl = list.dataset.url;

  function showComment(comment, prepend = false) {
    const item = document.createElement('li');
    item.className = 'comment-item';

    const metadata = document.createElement('p');
    metadata.className = 'comment-meta';
    metadata.textContent = `${comment.fecha} · ${comment.nombre}`;

    const text = document.createElement('p');
    text.textContent = comment.texto;
    item.append(metadata, text);

    if (prepend) {
      list.prepend(item);
    } else {
      list.append(item);
    }
  }

  async function loadComments() {
    const response = await fetch(commentsUrl);
    if (!response.ok) {
      throw new Error('No fue posible cargar los comentarios.');
    }
    const comments = await response.json();
    list.replaceChildren();
    message.textContent = '';
    message.className = 'form-message';

    if (comments.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'empty-state';
      empty.textContent = 'Este avistamiento aún no tiene comentarios.';
      list.append(empty);
      return;
    }
    comments.forEach((comment) => showComment(comment));
  }

  loadComments().catch((error) => {
    message.textContent = error.message || 'Ocurrió un error al cargar los comentarios.';
    message.className = 'form-message error';
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = form.elements.nombre.value.trim();
    const text = form.elements.texto.value.trim();

    if (name.length < 3 || name.length > 50) {
      message.textContent = 'El nombre debe tener entre 3 y 50 caracteres.';
      message.className = 'form-message error';
      return;
    }
    if (text.length < 5 || text.length > 300) {
      message.textContent = 'El comentario debe tener entre 5 y 300 caracteres.';
      message.className = 'form-message error';
      return;
    }

    submitButton.disabled = true;
    message.textContent = 'Enviando comentario…';
    message.className = 'form-message';
    try {
      const response = await fetch(commentsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: name, texto: text })
      });
      const result = await response.json();
      if (!response.ok) {
        const errors = result.errors ? Object.values(result.errors).join(' ') : result.error;
        throw new Error(errors || 'No fue posible guardar el comentario.');
      }

      const emptyState = list.querySelector('.empty-state');
      if (emptyState) emptyState.remove();
      showComment(result, true);
      form.reset();
      message.textContent = 'Comentario agregado correctamente.';
      message.className = 'form-message success';
    } catch (error) {
      message.textContent = error.message || 'Ocurrió un error al guardar el comentario.';
      message.className = 'form-message error';
    } finally {
      submitButton.disabled = false;
    }
  });
});
