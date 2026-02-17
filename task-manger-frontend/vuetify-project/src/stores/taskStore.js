import { defineStore } from "pinia";
import {
  fetchTasks,
  deleteTask,
  startTask,
  stopTask,
  getTaskStats,
} from "@/services/taskService";
import { useUiStore } from "./uiStore";

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [],
    timer: null,
    stats: {
      totalTime: 0,
      pomodoroCount: 0,
      cronometerTime: 0,
      pomodoroTime: 0,
      tasksPerDay: {}
    },
  }),

  getters: {
    pendingTasks: (state) => state.tasks.filter((t) => !t.completed),
    completedTasks: (state) => state.tasks.filter((t) => t.completed),
    activeTask: (state) => state.tasks.find((t) => t.isRunning),
  },

  actions: {
    async loadTasks() {
      const data = await fetchTasks();
      this.tasks = data.map((task) => ({
        ...task,
        showDetails: false,
        elapsedTime: task.elapsedTime || 0,
        isRunning: task.isRunning || false,
      }));
      if (this.activeTask) this.resumeTimer(this.activeTask);
    },

    resumeTimer(task) {
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        task.elapsedTime += 1000;

        // 1. Actualizamos el título de la pestaña
        this.updateBrowserTitle(task);

        if (task.isPomodoro && task.elapsedTime >= task.totalPomodoroTime) {
          this.handleFinishPomodoro(task);
        }
      }, 1000);
    },

    async start(id) {
      const uiStore = useUiStore();
      if (this.activeTask) {
        uiStore.notify("Ya hay una tarea en curso", "error");
        return;
      }
      const task = this.tasks.find((t) => t._id === id);
      task.isRunning = true;
      this.resumeTimer(task);
      await startTask(id);
    },
    // Actualiza el título de la pestaña con el tiempo restante o transcurrido y el título de la tarea
    updateBrowserTitle(task) {
      let display;
      if (task.isPomodoro) {
        const remaining = task.totalPomodoroTime - task.elapsedTime;
        display = this.formatTimeForTitle(Math.max(0, remaining));
      } else {
        display = this.formatTimeForTitle(task.elapsedTime);
      }

      document.title = `${display} - ${task.title}`;
    },

    formatTimeForTitle(ms) {
      const minutes = Math.floor((ms % 3600000) / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    },

    async stop(id) {
      if (this.timer) clearInterval(this.timer);
      const task = this.tasks.find((t) => t._id === id);
      task.isRunning = false;
      task.completed = true;
      await stopTask(id);
      await this.loadTasks(); // Recargamos para mover a historial
      document.title = "ChronoTask"; // Reiniciamos el título de la pestaña
    },

    async remove(id) {
      const uiStore = useUiStore();
      const task = this.tasks.find((t) => t._id === id);
      if (task?.isRunning) clearInterval(this.timer);
      await deleteTask(id);
      this.tasks = this.tasks.filter((t) => t._id !== id);
      uiStore.notify("Tarea eliminada", "success");
    },

    async fetchStats() {
      this.stats = await getTaskStats();
    },

    handleFinishPomodoro(task) {
      const uiStore = useUiStore();
      new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg")
        .play()
        .catch(() => {});
      uiStore.notify(`¡Pomodoro finalizado: ${task.title}!`, "pomodoro");
      this.stop(task._id);
    },
  },
});
