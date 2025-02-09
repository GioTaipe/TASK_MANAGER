<template>
  <v-app>
    <!-- Pantalla de bienvenida -->
    <div v-if="showSplashScreen" class="splash-screen">
      <splash-screen></splash-screen>
    </div>

    <!-- Aplicación principal -->
    <div v-else transition-style="in:circle:hesitate" class="app-content">
      <router-view>
        <v-main>
          <v-container>
            <h1>CHRONO TASK</h1>

            <!-- Modal para agregar tarea -->
            <v-dialog v-model="showTaskForm" max-width="600px">
              <v-card>
                <v-card-text>
                  <task-form @task-saved="handleTaskSaved"></task-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="showTaskForm = false">Close</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <task-list ref="taskList" :tasks="tasks" @show-task-form="showTaskForm = true"></task-list>
          </v-container>
        </v-main>
      </router-view>
    </div>
  </v-app>
</template>

<script>
import TaskList from './components/TaskList.vue';
import TaskForm from './components/TaskForm.vue';
import SplashScreen from './components/SplashScreen.vue';
export default {
  components: {
    TaskList,
    TaskForm,
    SplashScreen,
  },
  data() {
    return {
      showTaskForm: false,
      taskToEdit: null,
      showSplashScreen: true,
    };
  },
  mounted() {
    setTimeout(() => {
      this.showSplashScreen = false;
    }, 3000);
  },
  methods: {
    handleTaskSaved() {
      this.taskToEdit = null;
      this.showTaskForm = false;
      this.$refs.taskList.fetchTasks();
    },
  },
};
</script>
<style>
main {
  background-color: #e0ebe2;
}

h1 {
  text-align: center;
  text-transform: uppercase;
  font-size: 50px;
}

.splash-screen {
  position: fixed;
  width: 100%;
  height: 100vh;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>