# ChronoTask - Pomodoro & Stopwatch Task Manager

Aplicacion web full-stack de gestion de tareas con seguimiento de tiempo integrado. Permite organizar tareas diarias eligiendo entre dos modos de temporizador: **Pomodoro** (sesiones de enfoque con cuenta regresiva) o **Cronometro** (tiempo libre sin limite). Cada dispositivo se identifica automaticamente sin necesidad de registro, manteniendo las tareas privadas por navegador.

---

## Tabla de Contenidos

- [Caracteristicas](#caracteristicas)
- [Stack Tecnologico](#stack-tecnologico)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Modelo de Datos](#modelo-de-datos)
- [API REST - Endpoints](#api-rest---endpoints)
- [Frontend - Componentes](#frontend---componentes)
- [State Management (Pinia)](#state-management-pinia)
- [Seguridad por Dispositivo](#seguridad-por-dispositivo)
- [Instalacion y Configuracion](#instalacion-y-configuracion)
- [Scripts Disponibles](#scripts-disponibles)
- [Testing](#testing)

---

## Caracteristicas

- **Doble modo de tiempo**: Pomodoro (configurable de 5 a 60 minutos, por defecto 25) y Cronometro (tiempo libre ilimitado).
- **Timer persistente**: El temporizador continua activo al navegar por la aplicacion gracias a Pinia. Al recargar la pagina, se reanuda automaticamente si habia una tarea en curso.
- **Titulo del navegador en tiempo real**: Mientras una tarea esta activa, la pestana del navegador muestra `MM:SS - Nombre de la Tarea`.
- **Notificacion al completar Pomodoro**: Reproduce un sonido y muestra una alerta visual cuando finaliza la sesion.
- **Fusion inteligente de tareas**: Al detener una tarea, el sistema busca tareas completadas con el mismo titulo, modo y dispositivo. Si encuentra una, fusiona el tiempo en lugar de crear un duplicado.
- **Panel de estadisticas**: Muestra tiempo total invertido, cantidad de Pomodoros realizados, tiempo por modo (Pomodoro vs Cronometro) y tiempo por dia.
- **Seguridad por dispositivo**: Sin registro ni login. Cada navegador genera un UUID unico que se almacena en `localStorage` y se envia como header en cada peticion.
- **Feedback visual completo**: Spinner de carga en todas las peticiones, notificaciones globales (exito, error, pomodoro) y barra de progreso circular para la tarea activa.

---

## Stack Tecnologico

### Frontend

| Tecnologia | Version | Proposito |
|---|---|---|
| Vue.js 3 | 3.x | Framework reactivo (Composition API) |
| Vuetify 3 | 3.x | Componentes UI Material Design |
| Pinia | 3.0.4 | Estado global reactivo |
| Axios | 1.13.5 | Cliente HTTP |
| Vite | 5.0.0 | Build tool y dev server |
| MDI Icons | 7.0.96 | Iconografia Material Design |

### Backend

| Tecnologia | Version | Proposito |
|---|---|---|
| Node.js | - | Runtime de JavaScript |
| Express | 4.21.2 | Framework HTTP |
| MongoDB | - | Base de datos NoSQL |
| Mongoose | 8.9.5 | ODM para MongoDB |
| Jest | 29.7.0 | Framework de testing |
| Supertest | 7.0.0 | Testing de endpoints HTTP |
| dotenv | 16.4.7 | Variables de entorno |
| CORS | 2.8.5 | Control de acceso cross-origin |

---

## Arquitectura del Proyecto

```
task-manager/
|
|-- task-manager-backend/
|   |-- src/
|   |   |-- config/
|   |   |   +-- mongoConnection.js    # Conexion a MongoDB Atlas
|   |   |-- controllers/
|   |   |   +-- taskController.js      # Manejo de requests/responses
|   |   |-- middlewares/
|   |   |   +-- authMiddleware.js      # Validacion de x-device-id
|   |   |-- models/
|   |   |   +-- Task.js                # Schema de Mongoose
|   |   |-- routes/
|   |   |   +-- taskRoutes.js          # Definicion de endpoints
|   |   |-- services/
|   |   |   +-- taskService.js         # Logica de negocio
|   |   |-- app.js                     # Configuracion de Express
|   |   +-- server.js                  # Entry point del servidor
|   |-- tests/
|   |   +-- task.test.js               # Tests de integracion
|   |-- .env                           # Variables de entorno
|   +-- package.json
|
|-- task-manger-frontend/
|   +-- vuetify-project/
|       |-- public/
|       |   |-- favicon.svg            # Icono de la app (SVG)
|       |   +-- crono_icon.png         # Icono fallback (PNG)
|       |-- src/
|       |   |-- api/
|       |   |   +-- axios.js           # Instancia Axios + interceptores
|       |   |-- components/
|       |   |   |-- Navbar.vue         # Barra de navegacion
|       |   |   |-- TaskForm.vue       # Formulario de creacion de tareas
|       |   |   |-- TaskList.vue       # Vista principal (tareas + historial)
|       |   |   +-- NotificationDialog.vue  # Alertas globales
|       |   |-- plugins/
|       |   |   |-- index.js           # Registro de plugins
|       |   |   +-- vuetify.js         # Configuracion de Vuetify
|       |   |-- services/
|       |   |   +-- taskService.js     # Funciones de llamada a la API
|       |   |-- stores/
|       |   |   |-- taskStore.js       # Estado y acciones de tareas
|       |   |   +-- uiStore.js         # Estado de la interfaz
|       |   |-- App.vue                # Componente raiz
|       |   +-- main.js                # Bootstrap de la app
|       |-- index.html                 # HTML de entrada
|       |-- vite.config.mjs            # Configuracion de Vite
|       +-- package.json
|
+-- README.md
```

---

## Modelo de Datos

### Task (MongoDB)

| Campo | Tipo | Requerido | Descripcion |
|---|---|---|---|
| `title` | String | Si | Nombre de la tarea |
| `deviceId` | String | Si | UUID del dispositivo (indexado) |
| `isRunning` | Boolean | No | Si la tarea esta actualmente en curso |
| `completed` | Boolean | No | Si la tarea fue completada |
| `startTime` | Date | No | Momento en que se inicio la tarea |
| `elapsedTime` | Number | No | Tiempo total transcurrido (milisegundos) |
| `isPomodoro` | Boolean | No | `true` = Pomodoro, `false` = Cronometro |
| `totalPomodoroTime` | Number | No | Duracion configurada para el Pomodoro (ms) |
| `createdAt` | Date | Auto | Fecha de creacion (timestamps de Mongoose) |
| `updatedAt` | Date | Auto | Fecha de ultima actualizacion |

---

## API REST - Endpoints

Todos los endpoints estan bajo el prefijo `/api` y requieren el header `x-device-id`.

### Tareas

| Metodo | Ruta | Descripcion | Body |
|---|---|---|---|
| `GET` | `/api` | Obtener todas las tareas del dispositivo | - |
| `POST` | `/api` | Crear una nueva tarea | `{ title, isPomodoro, totalPomodoroTime }` |
| `PATCH` | `/api/:id` | Actualizar una tarea existente | `{ title, ... }` |
| `DELETE` | `/api/:id` | Eliminar una tarea | - |

### Control del Temporizador

| Metodo | Ruta | Descripcion |
|---|---|---|
| `POST` | `/api/:id/start` | Iniciar o reanudar el temporizador de una tarea |
| `POST` | `/api/:id/stop` | Detener el temporizador y guardar el tiempo transcurrido |

### Estadisticas

| Metodo | Ruta | Descripcion |
|---|---|---|
| `GET` | `/api/stats` | Obtener estadisticas de productividad del dispositivo |

#### Respuesta de `/api/stats`

```json
{
  "totalTime": 3600000,
  "pomodoroCount": 3,
  "pomodoroTime": 2700000,
  "cronometerTime": 900000,
  "tasksPerDay": [
    { "_id": "2025-01-15", "totalElapsedTime": 1800000 }
  ]
}
```

### Codigos de Respuesta

| Codigo | Significado |
|---|---|
| `200` | Operacion exitosa |
| `201` | Tarea creada exitosamente |
| `400` | Error de validacion (ej: titulo vacio) |
| `401` | Header `x-device-id` no proporcionado |
| `404` | Tarea no encontrada |
| `500` | Error interno del servidor |

---

## Frontend - Componentes

### `App.vue`
Componente raiz que orquesta la aplicacion. Contiene el overlay de carga (spinner), el dialogo de notificaciones globales, la barra de navegacion y el contenedor principal con el formulario de tareas (en modal) y la lista de tareas.

### `Navbar.vue`
Barra de navegacion superior con el nombre de la aplicacion "Chrono Task" y el icono `mdi-timer-check-outline`. Color de fondo `grey-lighten-4` y texto en `deep-purple-darken-1`.

### `TaskForm.vue`
Formulario modal para crear nuevas tareas con los siguientes campos:
- **Titulo**: Campo de texto con validacion (minimo 3 caracteres).
- **Modo**: Selector entre Cronometro y Pomodoro.
- **Duracion Pomodoro**: Slider de 5 a 60 minutos (solo visible en modo Pomodoro, por defecto 25 min).

### `TaskList.vue`
Vista principal con layout de dos columnas:
- **Columna izquierda (70%)**: Muestra la tarea activa con una barra de progreso circular (cuenta regresiva para Pomodoro, tiempo transcurrido para Cronometro), lista de tareas pendientes con botones de play/stop/eliminar, boton para agregar tarea y boton de estadisticas.
- **Columna derecha (30%)**: Historial de tareas completadas con titulo tachado, tiempo invertido y opcion de eliminar.

Incluye un dialogo de estadisticas que muestra el resumen de productividad.

### `NotificationDialog.vue`
Componente de notificaciones globales con tres tipos:
- **success**: Icono verde de check.
- **error**: Icono rojo de alerta.
- **pomodoro**: Icono naranja de reloj (cuando finaliza un Pomodoro).

---

## State Management (Pinia)

### `taskStore`

Gestiona el estado de las tareas y el temporizador.

**Estado:**
- `tasks` - Array con todas las tareas del dispositivo.
- `timer` - Referencia al `setInterval` del temporizador activo.
- `stats` - Objeto con las estadisticas de productividad.

**Getters:**
- `pendingTasks` - Tareas no completadas.
- `completedTasks` - Tareas finalizadas.
- `activeTask` - Tarea actualmente en ejecucion (`isRunning: true`).

**Acciones principales:**
- `loadTasks()` - Carga las tareas desde la API y reanuda el timer si hay una tarea activa.
- `start(id)` - Inicia el temporizador de una tarea (intervalo de 1 segundo).
- `stop(id)` - Detiene el temporizador y marca la tarea como completada.
- `remove(id)` - Elimina una tarea del servidor y del estado local.
- `fetchStats()` - Obtiene las estadisticas de productividad.

### `uiStore`

Gestiona el estado de la interfaz de usuario.

**Estado:**
- `isLoading` - Controla la visibilidad del spinner de carga.
- `showNotification` / `message` / `type` - Estado de las notificaciones globales.
- `isTaskFormOpen` - Controla la visibilidad del formulario de creacion de tareas.

---

## Seguridad por Dispositivo

La autenticacion se basa en un identificador unico por dispositivo:

1. Al cargar la app por primera vez, el frontend genera un **UUID v4** y lo almacena en `localStorage` bajo la clave `chrono_device_id`.
2. Cada peticion HTTP incluye este UUID en el header `x-device-id` mediante un interceptor de Axios.
3. El middleware `authMiddleware` del backend valida que el header exista. Si no esta presente, responde con `401 Unauthorized`.
4. Todos los queries a la base de datos filtran por `deviceId`, asegurando que cada dispositivo solo puede ver y manipular sus propias tareas.

---

## Instalacion y Configuracion

### Requisitos Previos

- Node.js (v18 o superior recomendado)
- MongoDB Atlas (o instancia local de MongoDB)
- npm

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd task-manager
```

### 2. Configurar el Backend

```bash
cd task-manager-backend
npm install
```

Crear un archivo `.env` en la raiz del backend:

```env
URL_MONGO=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=<app>
PORT=3002
```

### 3. Configurar el Frontend

```bash
cd task-manger-frontend/vuetify-project
npm install
```

> **Nota:** La URL de la API esta configurada en `src/api/axios.js` apuntando a `http://localhost:3002/api`. Modificar si el backend corre en otro puerto.

### 4. Ejecutar la aplicacion

Iniciar el backend:

```bash
cd task-manager-backend
npm run dev
```

Iniciar el frontend (en otra terminal):

```bash
cd task-manger-frontend/vuetify-project
npm run dev
```

La aplicacion estara disponible en:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3002/api

---

## Scripts Disponibles

### Backend (`task-manager-backend/`)

| Script | Comando | Descripcion |
|---|---|---|
| `dev` | `npx nodemon src/server.js` | Inicia el servidor con recarga automatica |
| `test` | `npx jest --verbose` | Ejecuta los tests de integracion |

### Frontend (`task-manger-frontend/vuetify-project/`)

| Script | Comando | Descripcion |
|---|---|---|
| `dev` | `vite --port 3000` | Inicia el servidor de desarrollo |
| `build` | `vite build` | Genera el build de produccion |
| `preview` | `vite preview` | Previsualiza el build de produccion |

---

## Testing

El backend incluye tests de integracion con Jest y Supertest ubicados en `tests/task.test.js`:

```bash
cd task-manager-backend
npm test
```

Los tests cubren:
- Validacion de creacion de tareas (titulo vacio retorna 400).
- Creacion exitosa de tareas (retorna 201).
- Seguridad por dispositivo (sin header `x-device-id` retorna 401).
- Eliminacion de tareas con verificacion de ID y deviceId.
- Manejo de errores del servidor (retorna 500).
