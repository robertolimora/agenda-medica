document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');
  const loadingEl = document.getElementById('loading');
  const modal = document.getElementById('modal');
  const modalDetails = document.getElementById('modalDetails');
  const closeModalBtn = document.getElementById('closeModal');
  const reloadBtn = document.getElementById('reload');

  reloadBtn.addEventListener('click', () => {
    location.reload();
  });

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: true,
    eventResizableFromStart: true,
    events: {
      url: 'php/carregar.php',
      method: 'POST',
      failure() {
        showToast('Erro ao carregar eventos.');
      }
    },
    eventDidMount() {
      loadingEl.style.display = 'none';
      calendarEl.classList.add('show');
    },
    eventClick(info) {
      const event = info.event;
      modalDetails.innerHTML = `
        <p><strong>Consulta:</strong> ${event.title}</p>
        <p><strong>Data:</strong> ${event.start.toLocaleString()}</p>
      `;
      modal.style.display = 'flex';
      closeModalBtn.focus();
    },
    eventDrop(info) {
      updateEvent(info.event);
    },
    eventResize(info) {
      updateEvent(info.event);
    }
  });

  calendar.render();

  closeModalBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
  });

  function closeModal() {
    modal.style.display = 'none';
  }

  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  function updateEvent(event) {
    fetch('php/salvar.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: event.id,
        title: event.title,
        start: event.start.toISOString(),
        end: event.end ? event.end.toISOString() : null
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showToast('Compromisso atualizado');
      } else {
        showToast('Erro ao atualizar');
      }
    })
    .catch(() => showToast('Erro de rede'));
  }
});
