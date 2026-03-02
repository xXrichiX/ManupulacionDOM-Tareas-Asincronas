# Diagrama de flujo: The Persistence Tasker

## Cómo viaja el dato desde el input hasta el servidor y de regreso al DOM

### 1. Carga inicial (al abrir la página)

```
Usuario abre http://localhost:3000
        ↓
Vue: onMounted() → fetch('/api/tasks')
        ↓
Express: GET /api/tasks → lee tasks.json → responde JSON
        ↓
Vue: tasks = respuesta → loading = false
        ↓
DOM: v-for renderiza cada tarea (lista reactiva)
```

### 2. Agregar tarea

```
Usuario escribe en input y hace clic en "Agregar"
        ↓
Vue: addTask() → fetch POST /api/tasks con body { title }
        ↓
Express: POST /api/tasks → genera id → guarda en tasks.json → responde 201 + tarea
        ↓
Vue: tasks.push(tarea) → newTaskTitle = ''
        ↓
DOM: la nueva fila aparece sin recargar (reactividad)
```

### 3. Eliminar tarea

```
Usuario hace clic en "Eliminar" de una tarea
        ↓
Vue: deleteTask(id) → fetch DELETE /api/tasks/:id
        ↓
Express: DELETE /api/tasks/:id → borra de array → guarda tasks.json → responde 200
        ↓
Vue: tasks = tasks.filter(t => t.id !== id)
        ↓
DOM: la fila desaparece de la lista (renderizado condicional / lista reactiva)
```

### Resumen de conceptos

| Paso | Concepto |
|------|----------|
| CORS | El frontend (mismo origen con Express static) y Postman pueden llamar a la API |
| onMounted | Petición asíncrona al montar el componente para datos iniciales |
| v-for | Mapeo del arreglo de tareas a elementos HTML (manipulación dinámica del DOM) |
| fetch() | Comunicación asíncrona cliente–servidor con JSON |
