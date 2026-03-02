# The Persistence Tasker — Práctica 2

Sistema de gestión de tareas con persistencia en servidor (Node.js + Express) y frontend dinámico (Vue 3).

## Requisitos

- Node.js instalado

## Instalación y ejecución

```bash
cd "/Users/angelricardo/Desarrollo Web"
npm install
npm start
```

Abre en el navegador: **http://localhost:3000**

## Estructura

- `server.js` — API REST (GET, POST, DELETE) y archivo estático
- `tasks.json` — Persistencia de tareas (se crea/actualiza automáticamente)
- `public/index.html` — Cliente Vue 3 (CDN) con lista reactiva y estados de carga

## Probar la API con Postman

1. **GET** `http://localhost:3000/api/tasks` — Lista de tareas
2. **POST** `http://localhost:3000/api/tasks` — Body (JSON): `{ "title": "Mi tarea" }`
3. **DELETE** `http://localhost:3000/api/tasks/:id` — Sustituir `:id` por el ID de una tarea

Los logs del servidor en consola muestran cada petición recibida (para captura de pantalla de pruebas).
