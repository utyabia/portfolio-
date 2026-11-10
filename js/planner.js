/* ==========================================================================
   planner.js — Academic Planner (interactive task management system)

   How it works
   - All tasks live in ONE array called `tasks`. Each task is an object:
       { id, title, course, due, priority, done, createdAt }
   - Every action (add, complete, delete, filter) changes the array first,
     then calls render(), which rebuilds the visible list from the array.
     The array is the "single source of truth"; the page is just a view of it.
   - The array is saved to localStorage so tasks survive a page refresh.
   ========================================================================== */

const STORAGE_KEY = "utibe-planner-tasks";

let tasks = loadTasks();     // array of task objects
let currentFilter = "all";   // "all" | "active" | "completed"

// Cache the DOM elements we use often.
const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const courseInput = document.getElementById("task-course");
const dueInput = document.getElementById("task-due");
const priorityInput = document.getElementById("task-priority");
const formError = document.getElementById("task-error");
const list = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearDoneBtn = document.getElementById("clear-done");

/* ---------- ADD A TASK ---------- */
form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the browser from reloading the page

  const title = titleInput.value.trim();
  if (title === "") {
    formError.textContent = "Please describe the task before adding it.";
    titleInput.focus();
    return;
  }
  formError.textContent = "";

  const newTask = {
    id: Date.now(),                      // unique number based on the current time
    title: title,
    course: courseInput.value.trim(),
    due: dueInput.value,                 // "YYYY-MM-DD" or ""
    priority: priorityInput.value,       // "low" | "medium" | "high"
    done: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  saveTasks();
  render();
  form.reset();
  titleInput.focus();
});

/* ---------- COMPLETE / DELETE (event delegation) ----------
   Instead of attaching a listener to every task, one listener on the <ul>
   catches clicks from any task inside it, including tasks added later. */
list.addEventListener("change", function (event) {
  if (event.target.matches(".task-check")) {
    const id = Number(event.target.closest(".task").dataset.id);
    toggleTask(id);
  }
});

list.addEventListener("click", function (event) {
  const button = event.target.closest(".delete-btn");
  if (!button) return;
  const item = button.closest(".task");
  item.classList.add("removing");                       // play the slide-out animation
  setTimeout(function () { deleteTask(Number(item.dataset.id)); }, 250);
});

function toggleTask(id) {
  tasks = tasks.map(function (task) {
    return task.id === id ? Object.assign({}, task, { done: !task.done }) : task;
  });
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) { return task.id !== id; });
  saveTasks();
  render();
}

/* ---------- FILTERS ---------- */
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(function (b) {
      b.classList.toggle("active", b === button);
      b.setAttribute("aria-pressed", String(b === button));
    });
    render();
  });
});

clearDoneBtn.addEventListener("click", function () {
  tasks = tasks.filter(function (task) { return !task.done; });
  saveTasks();
  render();
});

/* ---------- RENDER: rebuild the list from the array ---------- */
function render() {
  const visible = getVisibleTasks();
  list.innerHTML = "";

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = currentFilter === "completed"
      ? "No completed tasks yet — tick one off!"
      : "Nothing here. Add your first task using the form.";
    list.appendChild(empty);
  }

  visible.forEach(function (task) {
    list.appendChild(createTaskElement(task));
  });

  updateStats();
}

function getVisibleTasks() {
  const filtered = tasks.filter(function (task) {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "completed") return task.done;
    return true;
  });
  // Unfinished first, then by due date (tasks without a date go last).
  return filtered.slice().sort(function (a, b) {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return (a.due || "9999-12-31").localeCompare(b.due || "9999-12-31");
  });
}

// Build one <li> using createElement + textContent (never innerHTML),
// so text typed by the user can never be run as HTML/JavaScript.
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task priority-" + task.priority + (task.done ? " done" : "");
  li.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-check";
  checkbox.checked = task.done;
  checkbox.setAttribute("aria-label", "Mark \"" + task.title + "\" as completed");

  const body = document.createElement("div");
  const title = document.createElement("div");
  title.className = "task-title";
  title.textContent = task.title;

  const meta = document.createElement("div");
  meta.className = "task-meta";
  if (task.course) meta.appendChild(makeSpan("📘 " + task.course));
  if (task.due) {
    const dueSpan = makeSpan("📅 " + formatDate(task.due));
    if (!task.done && isOverdue(task.due)) {
      dueSpan.className = "overdue";
      dueSpan.textContent += " · overdue";
    }
    meta.appendChild(dueSpan);
  }
  meta.appendChild(makeSpan("⚑ " + capitalise(task.priority) + " priority"));
  body.append(title, meta);

  const del = document.createElement("button");
  del.type = "button";
  del.className = "delete-btn";
  del.textContent = "✕";
  del.setAttribute("aria-label", "Delete \"" + task.title + "\"");

  li.append(checkbox, body, del);
  return li;
}

/* ---------- STATISTICS ---------- */
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(function (t) { return t.done; }).length;
  const pending = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-done").textContent = completed;
  document.getElementById("stat-pending").textContent = pending;
  document.getElementById("progress-fill").style.width = percent + "%";
  document.getElementById("progress-text").textContent = percent + "% complete";
  clearDoneBtn.disabled = completed === 0;
}

/* ---------- HELPERS ---------- */
function makeSpan(text) {
  const span = document.createElement("span");
  span.textContent = text;
  return span;
}

function capitalise(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatDate(isoDate) {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function isOverdue(isoDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(isoDate + "T00:00:00") < today;
}

/* ---------- SAVE / LOAD (localStorage stores text, so we use JSON) ---------- */
function saveTasks() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch (e) { /* storage blocked */ }
}

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch (e) { /* corrupted or blocked storage: fall through */ }

  // First visit: show a few example tasks so the planner is not empty.
  const inDays = function (n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  return [
    { id: 1, title: "Submit CSC 106 portfolio project", course: "CSC 106", due: inDays(5), priority: "high", done: false, createdAt: "" },
    { id: 2, title: "Prepare Power BI module for the next bootcamp", course: "Fabulous Data School", due: inDays(8), priority: "medium", done: false, createdAt: "" },
    { id: 3, title: "Clean and explore field-trial dataset", course: "NRCRI research", due: inDays(12), priority: "medium", done: false, createdAt: "" },
    { id: 4, title: "Revise JavaScript events and DOM notes", course: "CSC 106", due: inDays(9), priority: "low", done: false, createdAt: "" },
    { id: 5, title: "Read study unit on CSS Flexbox and Grid", course: "CSC 106", due: inDays(-2), priority: "low", done: true, createdAt: "" }
  ];
}

// Draw the list for the first time.
render();
