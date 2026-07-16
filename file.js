/* =========================================
   1. MOBILE NAVIGATION TOGGLE
   Runs on every page (elements guarded with
   an if-check so it fails silently if absent)
   ========================================= */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    navToggle.classList.toggle('active');
    const isOpen = mainNav.classList.contains('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}

/* =========================================
   2. ACADEMIC PLANNER (planner.html only)
   Data is stored in a plain JS array of
   task objects: { id, text, date, completed }
   ========================================= */
const taskForm = document.getElementById('taskForm');

if (taskForm) {
  let tasks = []; // <-- the array that holds all task state

  const taskInput = document.getElementById('taskInput');
  const taskDate = document.getElementById('taskDate');
  const taskList = document.getElementById('taskList');
  const taskCount = document.getElementById('taskCount');
  const taskCompleted = document.getElementById('taskCompleted');
  const emptyState = document.getElementById('emptyState');

  // Adding a new task
  taskForm.addEventListener('submit', function (e) {
    e.preventDefault(); // stop the form from reloading the page

    const text = taskInput.value.trim();
    if (text === '') return; // ignore empty submissions

    tasks.push({
      id: Date.now(),      // simple unique ID based on timestamp
      text: text,
      date: taskDate.value,
      completed: false
    });

    taskInput.value = '';
    taskDate.value = '';
    renderTasks();
  });

  // Event delegation: ONE listener on the <ul> handles clicks on
  // every "Done" and "Delete" button, even ones added later.
  taskList.addEventListener('click', function (e) {
    const li = e.target.closest('li');
    if (!li) return;
    const id = Number(li.dataset.id);

    if (e.target.classList.contains('complete-btn')) {
      tasks = tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      renderTasks();
    }

    if (e.target.classList.contains('delete-btn')) {
      tasks = tasks.filter(t => t.id !== id);
      renderTasks();
    }
  });

  // Rebuilds the entire task list in the DOM from the tasks array
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
          ${task.date ? `<small class="task-date">(Due: ${task.date})</small>` : ''}
        </span>
        <div class="task-actions">
          <button class="complete-btn">${task.completed ? '↺ Undo' : '✓ Done'}</button>
          <button class="delete-btn">🗑 Delete</button>
        </div>
      `;

      taskList.appendChild(li);
    });

    taskCount.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;
    taskCompleted.textContent = `${tasks.filter(t => t.completed).length} completed`;
  }

  // Prevents raw HTML in a task from breaking the page (basic XSS safety)
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

/* =========================================
   3. CONTACT FORM VALIDATION (contact.html only)
   ========================================= */
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
