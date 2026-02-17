<template>
  <v-app>
    <!-- Spinner de carga -->
    <v-overlay :model-value="uiStore.isLoading" class="align-center justify-center" persistent>
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <NotificationDialog v-model="uiStore.showNotification" :message="uiStore.message" :type="uiStore.type" />
    <!-- Aplicación principal -->
    <v-main>
      <Navbar></Navbar>
      <v-container>
        <v-dialog v-model="uiStore.isTaskFormOpen" max-width="600px">
          <task-form></task-form>
        </v-dialog>
        <task-list ref="taskList"></task-list>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { useUiStore } from '@/stores/uiStore';
import NotificationDialog from '@/components/NotificationDialog.vue';
import TaskList from './components/TaskList.vue';
import TaskForm from './components/TaskForm.vue';
import Navbar from './components/Navbar.vue';

export default {
  components: {
    TaskList,
    TaskForm,
    Navbar,
    NotificationDialog
  },

  setup() {
    const uiStore = useUiStore();
    return { uiStore }; // Esto hace que uiStore esté disponible en el template y en el resto del componente
  },
};
</script>
<style>
h1 {
  text-align: center;
  text-transform: uppercase;
  font-size: 50px;
}
</style>