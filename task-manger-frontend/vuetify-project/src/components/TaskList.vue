<template>
  <!-- Confirm Dialog -->
  <confirm-dialog v-if="showDialog" title="Start a new task?"
    message="You already have a task running. Do you want to stop it and start a new one?" @confirm="confirmStop"
    @cancel="cancelDialog" />

  <!-- Pending Tasks -->
  <v-container>
    <v-row>
      <v-col>
        <v-card class="card">
          <v-row style="display: flex; align-content: center; justify-content: space-between; margin: 1px;">
            <v-card-title>PENDING TASK</v-card-title>
            <v-col cols="auto">
              <v-btn class="button" @click="checkAndShowTaskForm">Add Task</v-btn>
            </v-col>
          </v-row>
          <v-col v-for="task in pendingTasks" :key="task._id" cols="12">
            <v-card class="task-card">
              <v-card-title>{{ task.title }}</v-card-title>
              <v-card-text>{{ task.description }}</v-card-text>
              <v-card-actions>
                <v-btn class="button" v-if="!task.isRunning" @click="startTask(task._id)">Start</v-btn>
                <v-btn class="button" v-if="task.isRunning" @click="stopTask(task._id)">Stop</v-btn>
                <v-btn class="button" @click="deleteTask(task._id)">Delete</v-btn>
              </v-card-actions>
              <v-col v-if="task.isRunning" cols="12">
                <v-card class="card">
                  <h2>{{ formattedTime }}</h2>
                </v-card>
              </v-col>
            </v-card>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Completed Tasks -->
  <v-container>
    <v-row>
      <v-col>
        <v-card class="card">
          <v-card-title>COMPLETED TASK</v-card-title>
          <v-col v-for="task in completedTasks" :key="task._id" cols="12">
            <v-card class="task-card">
              <v-card-title>{{ task.title }}</v-card-title>
              <v-col>
                <span>{{ formatElapsedTime(task.elapsedTime) }}</span>
              </v-col>
              <v-card-actions>
                <v-btn class="button" @click="showDetails(task._id)">Details</v-btn>
                <v-btn class="button" @click="deleteTask(task._id)">Delete</v-btn>
              </v-card-actions>
              <v-col v-if="task.showDetails" cols="12">
                <v-card class="card">
                  <v-card-text>{{ task.description }}</v-card-text>
                </v-card>
              </v-col>
            </v-card>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ConfirmDialog from './ConfirmDialog.vue';
import { fetchTasks, deleteTask, startTask, stopTask, updateTask } from '../services/taskService';

export default {
  name: 'TaskList',
  components: {
    ConfirmDialog,
  },
  data() {
    return {
      tasks: [],
      elapsedTime: 0, // Tiempo transcurrido en milisegundos
      timer: null, // Referencia al intervalo
      isRunning: false, // Estado del cronómetro
      showDialog: false, // Mostrar diálogo de confirmación
      taskToDelete: null, // Tarea a eliminar
    };
  },
  computed: {
    formattedTime() {
      // Convertir milisegundos a formato hh:mm:ss
      const hours = String(Math.floor(this.elapsedTime / 3600000)).padStart(2, "0");
      const minutes = String(Math.floor((this.elapsedTime % 3600000) / 60000)).padStart(2, "0");
      const seconds = String(Math.floor((this.elapsedTime % 60000) / 1000)).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    },
    // Filtrar las tareas pendientes
    pendingTasks() {
      return this.tasks.filter(task => !task.completed);
    },
    // Filtrar las tareas completadas
    completedTasks() {
      return this.tasks.filter(task => task.completed);
    },
  },
  methods: {
    // Obtener las tareas desde el servidor
    async fetchTasks() {
      const data = await fetchTasks();
      this.tasks = data.map(task => ({
        ...task,
        showDetails: false, // Inicialmente oculto
        elapsedTime: task.elapsedTime || 0, // Inicializar en 0 si no existe
        isRunning: false, // Inicialmente detenido
        timer: null, // Agregar una referencia para el intervalo
      }));
    },
    // Mostrar el formulario para agregar una tarea
    checkAndShowTaskForm() {
      // Verificar si hay una tarea en ejecución
      const runningTask = this.tasks.find(task => task.isRunning);
      if (runningTask) {
        alert("You already have a task running. You must stop it before creating a new one.");
        return;
      }
      this.$emit('show-task-form');
    },
    // Formatear el tiempo transcurrido
    formatElapsedTime(elapsedTime) {
      // Convertir milisegundos a formato hh:mm:ss
      const hours = String(Math.floor(elapsedTime / 3600000)).padStart(2, "0");
      const minutes = String(Math.floor((elapsedTime % 3600000) / 60000)).padStart(2, "0");
      const seconds = String(Math.floor((elapsedTime % 60000) / 1000)).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    },
    // Iniciar una tarea
    async startTask(id) {
      const task = this.tasks.find(t => t._id === id);
      if (!task) return;
      const runningTask = this.tasks.find(t => t.isRunning);
      if (runningTask) {
        this.taskToStart = task;
        this.showDialog = true;
        return;
      }
      // Detener cualquier intervalo existente
      if (this.timer) clearInterval(this.timer);

      // Iniciar el cronómetro para esta tarea
      task.isRunning = true;
      this.timer = setInterval(() => {
        this.elapsedTime += 1000; // Incrementar cada segundo
      }, 1000);

      // Notificar al servidor que la tarea ha comenzado
      await startTask(id);
    },
    // Detener una tarea
    async stopTask(id) {
      const task = this.tasks.find(t => t._id === id);
      // Si task no tiene un valor válido, la función se detiene y no ejecuta el resto del código.
      if (!task) return;

      // Detener el cronómetro
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      task.completed = true;
      task.isRunning = false; // Notificar al servidor el tiempo transcurrido

      // Normalizar el título (convertir a minúsculas y eliminar espacios extra)
      const normalizeTitle = (title) => title.toLowerCase().replace(/\s+/g, "");

      const normalizedTitle = normalizeTitle(task.title);

      // Buscar si existe una tarea completada con el mismo título normalizado
      const completedTask = this.tasks.find(t => t.completed && normalizeTitle(t.title) === normalizedTitle);

      if (completedTask && task._id !== completedTask._id) {
        // Sumar el tiempo a la tarea existente
        completedTask.elapsedTime += this.elapsedTime;

        // Enviar la actualización al servidor
        await updateTask(completedTask._id, { elapsedTime: completedTask.elapsedTime });

        // Eliminar la tarea actual porque ya sumamos su tiempo
        await deleteTask(id);

      } else {
        await stopTask(id, this.elapsedTime);
      }
      this.elapsedTime = 0; // Reiniciar el tiempo transcurrido
      this.fetchTasks();
    },
    // Eliminar una tarea
    async deleteTask(id) {
      const runningTask = this.tasks.find(t => t.isRunning);

      // Verificar si hay una tarea en ejecución
      if (runningTask) {
        alert("You already have a task running. You must stop it before taking any further action.");
        return;
      } else {
        await deleteTask(id);
        this.fetchTasks();
      }
    },
    // Confirmar la detención de la tarea en ejecución
    confirmStop() {
      if (this.taskToStart) {
        // Detener la tarea en ejecución
        const runningTask = this.tasks.find(t => t.isRunning);
        if (runningTask) {
          this.stopTask(runningTask._id);
        }
      }
      this.showDialog = false;
    },
    // Cancelar el diálogo de confirmación
    cancelDialog() {
      this.taskToStart = null;
      this.showDialog = false;
    },
    // Mostrar u ocultar los detalles de una tarea
    async showDetails(id) {
      const task = this.tasks.find(t => t._id === id);
      if (!task) return;
      task.showDetails = !task.showDetails;
    },
  },
  created() {
    this.fetchTasks();
  },
};
</script>
<style scoped>
h2 {
  font-size: 2rem;
  display: flex;
  justify-content: center;
}

.card {
  border-radius: 15px;
  background: #c3d7c8;
  border-radius: 8px;
}

.task-card {
  width: 100%;
  padding: 10px;
  outline: none;
  border: none;
  color: #000;
  font-size: 1em;
  background: transparent;
  border-left: 2px solid #000;
  border-bottom: 2px solid #000;
  transition: 0.1s;
  border-bottom-left-radius: 8px;
}

button {
  background-color: #f3f7fe;
  color: #a8c4ad;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  width: 100px;
  height: 45px;
  transition: 0.3s;
}

button:hover {
  background-color: #a8c4ad;
  box-shadow: 0 0 0 5px #a8c4ad;
  color: #fff;
}

</style>
