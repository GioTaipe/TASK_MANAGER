# 🚀 Task Manager - Pomodoro & Tracker

Una aplicación moderna de gestión de tareas diseñada para maximizar la productividad. Permite a los usuarios organizar sus deberes diarios eligiendo entre un enfoque de tiempo libre (Cronómetro) o sesiones de enfoque profundo (Pomodoro).

## ✨ Características Principales

* **Doble Modo de Tiempo:** Elige entre Pomodoro (25 min por defecto, configurable) o Cronómetro para tareas abiertas.
* **Timer Persistente:** Gracias a la arquitectura con Pinia, el tiempo no se detiene al navegar por la aplicación.
* **Feedback Visual:** Barra de progreso circular para tareas activas y actualización en tiempo real del título de la pestaña del navegador.
* **Seguridad por Dispositivo:** Identificación única mediante el header `x-device-id` para mantener tus tareas privadas sin necesidad de registro.
* **Panel de Estadísticas:** Visualización del tiempo total invertido, cantidad de Pomodoros realizados y tiempo distribuido por modo.

## 🛠️ Stack Tecnológico

**Frontend:**
* Vue.js 3 (Composition API)
* Pinia (Manejo de estado global)
* Vuetify 3 (Material Design Framework)
* Axios (Cliente HTTP)

**Backend:**
* Node.js & Express
* MongoDB & Mongoose
* Jest & Supertest (Testing de integración)
