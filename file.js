/* MOBILE NAVIGATION TOGGLE */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    navToggle.classList.toggle('active');
    const isOpen = mainNav.classList.contains('open');
    // set aria-expanded explicitly as string "true" / "false"
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

/* ACADEMIC PLANNER */
const taskForm = document.getElementById('taskForm');

if (taskForm) {
  let tasks = [];

  const taskInput = document.getElementById('taskInput');
  const taskDate = document.getElementById('taskDate');
  const taskList = document.getElementById('taskList');
  const taskCount = document.getElementById('taskCount');
  const taskCompleted = document.getElementById('taskCompleted');
  const emptyState = document.getElementById('emptyState');

  // Persist / load
  function saveTasks() {
    try {
      localStorage.setItem('planner_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Could not save tasks', e);
    }
  }
  function loadTasks() {
    const raw = localStorage.getItem('planner_tasks');
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse tasks from storage', e);
      return [];
    }
  }

  // initialize from storage
  tasks = loadTasks();
  renderTasks();

  // Adding a new task
  taskForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const text = taskInput.value.trim();
    if (text === '') return;

    tasks.push({
      id: Date.now(),
      text: text,
      date: taskDate.value,
      completed: false
    });

    taskInput.value = '';
    taskDate.value = '';
    saveTasks();
    renderTasks();
  });

  // Event delegation for Done / Delete
  taskList.addEventListener('click', function (e) {
    const li = e.target.closest('li');
    if (!li) return;
    const id = Number(li.dataset.id);

    if (e.target.classList.contains('complete-btn')) {
      tasks = tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      saveTasks();
      renderTasks();
    }

    if (e.target.classList.contains('delete-btn')) {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      renderTasks();
    }
  });

  function renderTasks() {
    taskList.innerHTML = '';

    emptyState.style.display = tasks.length === 0 ? 'block' : 'none';

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');
      li.dataset.id = task.id;

      li.innerHTML = `
        <span class="task-text">
          ${escapeHTML(task.text)}
          ${task.date ? `<small class="task-date">(Due: ${escapeHTML(task.date)})</small>` : ''}
        </span>
        <div class="task-actions">
          <button type="button" class="complete-btn">${task.completed ? '↺ Undo' : '✓ Done'}</button>
          <button type="button" class="delete-btn">🗑 Delete</button>
        </div>
      `;

      taskList.appendChild(li);
    });

    taskCount.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;
    taskCompleted.textContent = `${tasks.filter(t => t.completed).length} completed`;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

/* CONTACT FORM VALIDATION (unchanged) */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const message = document.getElementById('message');
    const successEl = document.getElementById('formSuccess');

    // reset previous error messages
    ['nameError', 'emailError', 'phoneError', 'messageError'].forEach(clearError);

    if (name.value.trim() === '') {
      showError('nameError', 'Name is required.');
      isValid = false;
    }

    if (email.value.trim() === '') {
      showError('emailError', 'Email is required.');
      isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError('emailError', 'Enter a valid email address.');
      isValid = false;
    }

    if (phone.value.trim() === '') {
      showError('phoneError', 'Phone number is required.');
      isValid = false;
    } else if (!/^\d+$/.test(phone.value.trim())) {
      showError('phoneError', 'Phone number must contain digits only.');
      isValid = false;
    }

    if (message.value.trim() === '') {
      showError('messageError', 'Message cannot be empty.');
      isValid = false;
    }

    if (isValid) {
      successEl.textContent = 'Thank you! Your message has been received.';
      successEl.style.color = 'var(--color-success)';
      contactForm.reset();
    } else {
      successEl.textContent = '';
    }
  });

  function isValidEmail(email) {
    // basic pattern: something@something.something
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  function showError(id, msg) {
    document.getElementById(id).textContent = msg;
  }

  function clearError(id) {
    document.getElementById(id).textContent = '';
  }
}
