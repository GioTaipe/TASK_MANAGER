<template>
<!-- Sección de tarea activa -->
  <transition name="fade">
    <v-row v-if="activeTask" justify="center" class="mt-4 mb-6">
      <v-col cols="12" md="8" lg="6">
        <v-card class="timer-active-bg elevation-10 rounded-xl pa-6 text-center">
          <div class="text-subtitle-1 text-uppercase font-weight-bold mb-2 opacity-80">
            En progreso
          </div>
          <h2 class="text-h4 font-weight-bold mb-4">{{ activeTask.title }}</h2>

          <div class="d-flex justify-center align-center mb-6">
            <v-progress-circular :model-value="calculateProgress(activeTask)" :size="220" :width="12" color="white"
              bg-color="white" bg-opacity="0.2">
              <span class="text-h3 font-weight-bold">{{ displayTime(activeTask) }}</span>
            </v-progress-circular>
          </div>
          <div class="d-flex justify-center">
            <v-btn variant="flat" color="white" size="large" class="text-deep-purple font-weight-bold rounded-pill px-8"
              @click="stopTask(activeTask._id)">
              <v-icon left class="mr-2">mdi-check-circle</v-icon> Finalizar Tarea
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </transition>
<!-- Lista de tareas y historial -->
  <v-container>
    <v-row>
      <v-col cols="12" md="7">
        <v-card class="pa-4 rounded-xl shadow-md" color="grey-lighten-4" variant="flat" style="min-height: 400px;">
          <div class="d-flex align-center justify-space-between mb-4">
            <h3 class="text-h5 font-weight-bold grey--text text--darken-3">
              <v-icon left color="deep-purple" class="mr-2">mdi-playlist-play</v-icon> Tareas Pendientes
            </h3>
            <div>
              <v-btn color="deep-purple" class="rounded-lg" @click="checkAndShowTaskForm">
                <v-icon left class="mr-1">mdi-plus</v-icon> Nueva
              </v-btn>
              <v-btn icon variant="text" class="ml-2" @click="showStatsDialog">
                <v-icon color="deep-purple">mdi-chart-bar</v-icon>
              </v-btn>
            </div>
          </div>
          <v-fade-transition group>
            <v-card v-for="task in pendingTasks" :key="task._id" class="mb-4 task-card rounded-lg elevation-2"
              :class="task.isPomodoro ? 'task-pomodoro' : 'task-stopwatch'">
              <v-card-item>
                <template v-slot:prepend>
                  <v-avatar :color="task.isPomodoro ? 'red-lighten-5' : 'blue-lighten-5'" size="40">
                    <v-icon :color="task.isPomodoro ? 'red' : 'blue'" size="24">
                      {{ task.isPomodoro ? 'mdi-timer-sand' : 'mdi-timer-outline' }}
                    </v-icon>
                  </v-avatar>
                </template>
                <v-card-title class="font-weight-bold">{{ task.title }}</v-card-title>
                <v-card-subtitle>{{ task.description }}</v-card-subtitle>
                <template v-slot:append>
                  <div class="d-flex align-center">
                    <v-btn v-if="!task.isRunning" icon="mdi-play-circle" color="deep-purple" variant="text"
                      size="x-large" @click="startTask(task._id)"></v-btn>

                    <v-btn v-else icon="mdi-stop-circle" color="red" variant="text" size="x-large"
                      @click="stopTask(task._id)"></v-btn>

                    <v-btn icon="mdi-delete-outline" variant="text" color="grey-lighten-1"
                      @click="deleteTask(task._id)"></v-btn>
                  </div>
                </template>
              </v-card-item>
            </v-card>
          </v-fade-transition>
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <v-card class="pa-4 rounded-xl" variant="outlined" color="grey-lighten-1">
          <h3 class="text-h6 font-weight-bold mb-4 grey--text text--darken-2">Historial</h3>
          <v-slide-y-transition group>
            <v-card v-for="task in completedTasks" :key="task._id" class="mb-2 rounded-lg bg-grey-lighten-5 opacity-70"
              variant="flat">
              <v-card-item>
                <v-card-title class="text-subtitle-1 text-decoration-line-through grey--text">
                  {{ task.title }}
                </v-card-title>
                <v-card-subtitle>
                  <v-icon size="x-small" class="mr-1">mdi-clock-outline</v-icon>
                  {{ formatElapsedTime(task.elapsedTime) }}
                </v-card-subtitle>
                <template v-slot:append>
                  <v-btn icon="mdi-information-outline" size="small" variant="text" color="grey"
                    @click="showDetails(task._id)"></v-btn>
                </template>
              </v-card-item>
              <v-expand-transition>
                <div v-if="task.showDetails" class="pa-3 text-caption italic grey--text text--darken-1">
                  {{ task.description }}
                  <div class="mt-2">
                    <v-btn size="x-small" color="red-lighten-4" variant="flat" class="text-red-darken-4"
                      @click="deleteTask(task._id)">Eliminar del historial</v-btn>
                  </div>
                </div>
              </v-expand-transition>
            </v-card>
          </v-slide-y-transition>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
<!-- Diálogo de estadísticas -->
  <v-dialog v-model="statsDialog" max-width="600px">
    <v-card class="rounded-xl pa-4 card">
      <v-card-title class="headline d-flex justify-space-between align-center">
        Resumen de Productividad
        <v-icon color="primary">mdi-chart-areaspline</v-icon>
      </v-card-title>

      <v-divider class="mb-4"></v-divider>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-card flat class="pa-4 text-center rounded-lg" style="background: rgba(255,255,255,0.4)">
              <div class="text-overline">TIEMPO TOTAL INVERTIDO</div>
              <div class="text-h3 font-weight-bold">{{ formatElapsedTime(stats.totalTime) }}</div>
            </v-card>
          </v-col>

          <v-col cols="6">
            <v-card flat class="pa-3 rounded-lg" color="orange-lighten-4">
              <div class="caption grey--text text--darken-2 text-uppercase">Pomodoros</div>
              <div class="text-h5 font-weight-bold">{{ stats.pomodoroCount }}</div>
              <div class="caption">{{ formatElapsedTime(stats.pomodoroTime) }}</div>
            </v-card>
          </v-col>

          <v-col cols="6">
            <v-card flat class="pa-3 rounded-lg" color="blue-lighten-4">
              <div class="caption grey--text text--darken-2 text-uppercase">Cronómetro</div>
              <div class="text-h5 font-weight-bold">Libre</div>
              <div class="caption">{{ formatElapsedTime(stats.cronometerTime) }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-2" variant="text" @click="statsDialog = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useUiStore } from '@/stores/uiStore';
import { useTaskStore } from '@/stores/taskStore';

export default {
  name: 'TaskList',
  setup() {
    const uiStore = useUiStore();
    const taskStore = useTaskStore();
    return { uiStore, taskStore };
  },
  data() {
    return {
      statsDialog: false,
    };
  },
  computed: {
    // Estas propiedades apuntan al Store
    pendingTasks() { return this.taskStore.pendingTasks; },
    completedTasks() { return this.taskStore.completedTasks; },
    activeTask() { return this.taskStore.activeTask; },
    stats() { return this.taskStore.stats; }
  },
  methods: {
    // Lógica visual 
    calculateProgress(task) {
      if (!task.isPomodoro) return 100;
      return Math.min((task.elapsedTime / task.totalPomodoroTime) * 100, 100);
    },
    formatElapsedTime(ms) {
      const hours = String(Math.floor(ms / 3600000)).padStart(2, "0");
      const minutes = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
      const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    },
    displayTime(task) {
      if (task.isPomodoro) {
        const remaining = task.totalPomodoroTime - task.elapsedTime;
        return this.formatElapsedTime(Math.max(0, remaining));
      }
      return this.formatElapsedTime(task.elapsedTime);
    },

    // Lógica de interacción
    checkAndShowTaskForm() {
      if (this.activeTask) {
        this.uiStore.notify("Debes detener la tarea actual antes de crear una nueva.", "error");
        return;
      }
      this.uiStore.toggleTaskForm(true);
    },

    async showStatsDialog() {
      await this.taskStore.fetchStats();
      this.statsDialog = true;
    },

    showDetails(id) {
      const task = this.taskStore.tasks.find(t => t._id === id);
      if (task) task.showDetails = !task.showDetails;
    },

    // Llamadas directas a las acciones del Store
    fetchTasks() { this.taskStore.loadTasks(); },
    startTask(id) { this.taskStore.start(id); },
    stopTask(id) { this.taskStore.stop(id); },
    deleteTask(id) { this.taskStore.remove(id); }
  },
  created() {
    this.fetchTasks();
  }
};
</script>

<style scoped>
/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Tarjetas de Tarea */
.task-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 6px solid transparent !important;
}

.task-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
}

.task-pomodoro {
  border-left-color: #FF5252 !important;
}

.task-stopwatch {
  border-left-color: #2196F3 !important;
}

/* Hero Section Active */
.timer-active-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
}

.opacity-70 {
  opacity: 0.7;
}

.opacity-80 {
  opacity: 0.8;
}

.italic {
  font-style: italic;
}
</style>