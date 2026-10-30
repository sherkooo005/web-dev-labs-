let todos = [];
let currentFilter = 'all';

const inputEl = document.getElementById('new-todo');
const addBtn = document.getElementById('add-btn');
const listEl = document.getElementById('todo-list');
const countEl = document.getElementById('todo-count');
const filterBtns = document.querySelectorAll('.filter-btn');

// Add new todo
function addTodo() {
  const text = inputEl.value.trim();
  if (text) {
    todos.push({ id: Date.now(), text, completed: false });
    inputEl.value = '';
    render();
  }
}

addBtn.addEventListener('click', addTodo);
inputEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

// Delete and Toggle
listEl.addEventListener('click', (e) => {
  const id = Number(e.target.closest('li').dataset.id);
  if (e.target.classList.contains('delete-btn')) {
    todos = todos.filter(t => t.id !== id);
    render();
  } else if (e.target.type === 'checkbox') {
    const todo = todos.find(t => t.id === id);
    todo.completed = !todo.completed;
    render();
  }
});

// Double click to edit
listEl.addEventListener('dblclick', (e) => {
  if (e.target.tagName === 'SPAN') {
    const li = e.target.closest('li');
    const id = Number(li.dataset.id);
    const todo = todos.find(t => t.id === id);
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = todo.text;
    input.className = 'edit-input';
    
    li.replaceChild(input, e.target);
    input.focus();
    
    input.addEventListener('keypress', function(evt) {
      if (evt.key === 'Enter') {
        todo.text = this.value.trim() || todo.text;
        render();
      }
    });
    
    input.addEventListener('blur', function() {
      todo.text = this.value.trim() || todo.text;
      render();
    });
  }
});

// Filters
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

// Clear buttons
document.getElementById('clear-completed').addEventListener('click', () => {
  todos = todos.filter(t => !t.completed);
  render();
});

document.getElementById('clear-all').addEventListener('click', () => {
  todos = [];
  render();
});

// Render UI
function render() {
  listEl.innerHTML = '';
  
  let filteredTodos = todos;
  if (currentFilter === 'active') filteredTodos = todos.filter(t => !t.completed);
  if (currentFilter === 'completed') filteredTodos = todos.filter(t => t.completed);

  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.dataset.id = todo.id;
    li.className = todo.completed ? 'completed' : '';
    li.innerHTML = `
      <input type="checkbox" ${todo.completed ? 'checked' : ''}>
      <span>${todo.text}</span>
      <button class="delete-btn">🗑️</button>
    `;
    listEl.appendChild(li);
  });

  const activeCount = todos.filter(t => !t.completed).length;
  countEl.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
}