<template>
  <v-container>
    <v-form @submit.prevent="submitForm">
      <v-text-field v-model="task.title" label="Title" outlined required></v-text-field>
      <v-textarea v-model="task.description" label="Description" outlined required></v-textarea>
      <v-btn type="submit" color="primary">{{ isEdit ? 'Update' : 'Add' }} Task</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { createTask} from '../services/taskService';

export default {
  props: ['taskToEdit'],
  data() {
    return {
      task: {
        title: '',
        description: '',
      },
      isEdit: false,
    };
  },
  watch: {
    taskToEdit: {
      immediate: true,
      handler(newTask) {
        if (newTask) {
          this.task = { ...newTask };
          this.isEdit = true;
        } else {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    async submitForm() {
        await createTask(this.task);
      this.$emit('task-saved');
      this.resetForm();
    },
    resetForm() {
      this.task = {
        title: '',
        description: '',
      };
      this.isEdit = false;
    },
  },
};
</script>
