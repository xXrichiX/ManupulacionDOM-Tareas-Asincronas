const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Leer tareas desde archivo (o array vacío)
function readTasks() {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    console.error('Error leyendo tasks.json:', err.message);
    return [];
  }
}

// Escribir tareas al archivo
function writeTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
}

// Generar ID único
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// --- API REST ---

// Evitar 404 cuando el navegador pide el favicon
app.get('/favicon.ico', (req, res) => res.status(204).end());

// GET /api/tasks - Enviar lista completa de tareas
app.get('/api/tasks', (req, res) => {
  const tasks = readTasks();
  console.log('[GET /api/tasks] Enviando', tasks.length, 'tareas');
  res.json(tasks);
});

// POST /api/tasks - Recibir nueva tarea y asignar ID único
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Se requiere "title" (string)' });
  }
  const tasks = readTasks();
  const newTask = {
    id: generateId(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  writeTasks(tasks);
  console.log('[POST /api/tasks] Tarea creada:', newTask.id, newTask.title);
  res.status(201).json(newTask);
});

// PATCH /api/tasks/:id - Actualizar tarea (p. ej. completar)
app.patch('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const tasks = readTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  if (typeof completed === 'boolean') {
    tasks[index].completed = completed;
    writeTasks(tasks);
    console.log('[PATCH /api/tasks/:id] Tarea actualizada:', id, 'completed =', completed);
  }
  res.json(tasks[index]);
});

// DELETE /api/tasks/:id - Eliminar tarea por ID
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const tasks = readTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  const removed = tasks.splice(index, 1)[0];
  writeTasks(tasks);
  console.log('[DELETE /api/tasks/:id] Tarea eliminada:', id, removed.title);
  res.status(200).json({ message: 'Tarea eliminada', id });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log('API: GET /api/tasks | POST /api/tasks | PATCH /api/tasks/:id | DELETE /api/tasks/:id');
});
