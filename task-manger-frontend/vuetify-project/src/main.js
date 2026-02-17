/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Importamos pinia
import { createPinia } from 'pinia'

const app = createApp(App)

// Creamos una instancia de pinia
const pinia = createPinia()

// Usamos pinia en la aplicación
app.use(pinia)

registerPlugins(app)

app.mount('#app')
