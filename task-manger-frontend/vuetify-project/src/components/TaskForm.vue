<template>
  <v-card class="rounded-xl pa-6 shadow-md elevation-2" variant="flat" color="grey-lighten-4">
    <v-card-title class="text-h5 font-weight-bold px-0 mb-4 grey--text text--darken-3">
      <v-icon left color="deep-purple" class="mr-2">mdi-plus-circle-outline</v-icon>
      Nueva tarea
    </v-card-title>

    <v-form @submit.prevent="submitForm">
      <v-text-field 
        v-model="task.title" 
        label="Título de la tarea" 
        placeholder="Ej: Estudiar Java" 
        variant="solo"
        flat
        class="rounded-lg mb-2"
        bg-color="white"
        :rules="titleRules"
        required
      ></v-text-field>

      <v-select 
        v-model="task.isPomodoro" 
        :items="[
          { title: 'Cronómetro (Incremento)', value: false },
          { title: 'Pomodoro (Cuenta atrás)', value: true }
        ]" 
        item-title="title" 
        item-value="value" 
        label="Modo de tiempo" 
        variant="solo"
        flat
        bg-color="white"
        class="rounded-lg mb-2"
      >
        <template v-slot:prepend-inner>
          <v-icon :color="task.isPomodoro ? 'red' : 'blue'">
            {{ task.isPomodoro ? 'mdi-timer-sand' : 'mdi-timer-outline' }}
          </v-icon>
        </template>
      </v-select>

      <v-expand-transition>
        <div v-if="task.isPomodoro" class="px-2 py-4 mb-4 rounded-lg bg-white elevation-0">
          <div class="text-subtitle-2 mb-6 grey--text d-flex justify-space-between">
            <span>Duración de la sesión:</span>
            <span class="font-weight-bold text-red">{{ pomodoroMinutes }} minutos</span>
          </div>
          <v-slider 
            v-model="pomodoroMinutes" 
            min="5" 
            max="60" 
            step="5" 
            color="orange"
            track-color="red-lighten-4"
            thumb-label
          >
            <template v-slot:prepend>
              <v-icon color="orange">mdi-minus</v-icon>
            </template>
            <template v-slot:append>
              <v-icon color="orange">mdi-plus</v-icon>
            </template>
          </v-slider>
        </div>
      </v-expand-transition>

      <v-btn 
        type="submit" 
        block 
        size="large"
        class="timer-active-bg white--text font-weight-bold rounded-lg elevation-4 mt-4"
      >
        <v-icon left class="mr-2">mdi-rocket-launch</v-icon>
        Empezar {{ task.isPomodoro ? 'Pomodoro' : 'Tarea' }}
      </v-btn>
    </v-form>
  </v-card>
</template>

<script>
import { useUiStore } from '@/stores/uiStore';
import { useTaskStore } from '@/stores/taskStore';
import { createTask } from '@/services/taskService';

export default {
  setup() {
    const uiStore = useUiStore();
    const taskStore = useTaskStore();
    return { uiStore, taskStore };
  },
  data() {
    return {
      task: {
        title: '',
        isPomodoro: false,
        totalPomodoroTime: 0
      },
      pomodoroMinutes: 25, 
      titleRules: [
        v => !!v || 'El título es obligatorio',
        v => (v && v.trim().length >= 3) || 'Mínimo 3 caracteres'
      ],
    };
  },
  computed: {
    isFormValid() {
      return this.task.title && this.task.title.trim().length >= 3;
    }
  },
  methods: {
    async submitForm() {
      if (!this.isFormValid) return;
      
      try {
        if (this.task.isPomodoro) {
          this.task.totalPomodoroTime = this.pomodoroMinutes * 60000;
        }

        // 1. Llamar al servicio para guardar en BD
        await createTask(this.task); 
        
        // 2. Notificar éxito
        this.uiStore.notify("¡Tarea creada con éxito!", "success");

        // 3. Cerrar el formulario usando el Store
        this.uiStore.toggleTaskForm(false); 

        // 4. Refrescar la lista de tareas
        await this.taskStore.loadTasks();

        this.resetForm();
      } catch (error) {
        // El interceptor de Axios ya mostrará el error si falla
      }
    },
    resetForm() {
      this.task = {
        title: '',
        isPomodoro: false,
        totalPomodoroTime: 0
      };
      this.pomodoroMinutes = 25;
    },
  },
};
</script>

<style scoped>
.timer-active-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
}

.shadow-md {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
}
</style>