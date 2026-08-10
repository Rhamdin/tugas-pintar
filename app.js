const STORAGE_KEY = 'tugas-pintar-todos-v1';
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let filter = 'all';

const form = document.querySelector('#todoForm');
const input = document.querySelector('#todoInput');
const priority = document.querySelector('#priorityInput');
const list = document.querySelector('#todoList');
const empty = document.querySelector('#emptyState');

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); }
function escapeHTML(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function visibleTodos() { return todos.filter(t => filter === 'all' || (filter === 'active' ? !t.done : t.done)); }

function render() {
  const visible = visibleTodos();
  list.innerHTML = visible.map(t => `
    <li class="todo ${t.done ? 'done' : ''}" data-id="${t.id}">
      <button class="check" aria-label="Tandakan selesai"></button>
      <span class="task-text">${escapeHTML(t.text)}</span>
      <span class="badge ${t.priority}">${t.priority === 'high' ? 'Penting' : t.priority === 'low' ? 'Rendah' : 'Biasa'}</span>
      <button class="delete" aria-label="Padam tugas">✕</button>
    </li>`).join('');
  empty.classList.toggle('hidden', visible.length !== 0);
  list.classList.toggle('hidden', visible.length === 0);
  const total = todos.length, done = todos.filter(t => t.done).length, active = total - done;
  document.querySelector('#totalCount').textContent = total;
  document.querySelector('#activeCount').textContent = active;
  document.querySelector('#completedCount').textContent = done;
  const percent = total ? Math.round(done / total * 100) : 0;
  document.querySelector('#progressBar').style.width = percent + '%';
  document.querySelector('#progressText').textContent = percent + '% selesai';
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  todos.unshift({ id: crypto.randomUUID(), text, priority: priority.value, done: false, createdAt: Date.now() });
  input.value = ''; priority.value = 'normal'; save(); render(); input.focus();
});

list.addEventListener('click', e => {
  const item = e.target.closest('.todo'); if (!item) return;
  const id = item.dataset.id;
  if (e.target.closest('.check')) todos = todos.map(t => t.id === id ? {...t, done: !t.done} : t);
  if (e.target.closest('.delete')) todos = todos.filter(t => t.id !== id);
  save(); render();
});

document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active'); filter = btn.dataset.filter; render();
}));

document.querySelector('#clearCompleted').addEventListener('click', () => { todos = todos.filter(t => !t.done); save(); render(); });

const now = new Date();
document.querySelector('#todayDate').textContent = now.toLocaleDateString('ms-MY', { day:'numeric', month:'long', year:'numeric' });
document.querySelector('#todayLabel').textContent = now.toLocaleDateString('ms-MY', { weekday:'long' });
render();
