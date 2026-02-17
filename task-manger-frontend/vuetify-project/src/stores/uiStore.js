import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  // El "Estado": Son como las variables data() de un componente, pero globales.
  state: () => ({
    isLoading: false,
    showNotification: false,
    message: '',
    type: 'error',
    isTaskFormOpen: false,
  }),

  // Las "Acciones": Son como los methods: de un componente.
  actions: {
    setLoading(status) {
      this.isLoading = status
    },
    notify(msg, type = 'error') {
      this.message = msg
      this.type = type
      this.showNotification = true
    },
    hideNotification() {
      this.showNotification = false
    },
    toggleTaskForm(value) {
      this.isTaskFormOpen = value;
    },
  }
})