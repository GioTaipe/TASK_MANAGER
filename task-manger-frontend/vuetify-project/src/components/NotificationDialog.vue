<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="400">
    <v-card class="rounded-xl pa-4">
      <v-card-title class="justify-center">
        <v-icon size="64" :color="config.color">{{ config.icon }}</v-icon>
      </v-card-title>
      
      <v-card-text class="text-h6 text-center pt-4">
        {{ message }}
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn color="grey-darken-1" variant="text" @click="$emit('update:modelValue', false)">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    modelValue: Boolean, // Controla si se ve o no
    message: String,     // El texto que viene de Pinia
    type: String         // 'error', 'success', etc.
  },
  emits: ['update:modelValue'],
  computed: {
    // Esto reemplaza la lógica del "if" que tenías en el método open
    config() {
      switch (this.type) {
        case 'success': return { icon: 'mdi-check-circle', color: 'success' };
        case 'error':   return { icon: 'mdi-alert-circle', color: 'error' };
        case 'pomodoro': return { icon: 'mdi-clock-check', color: 'orange' };
        default:        return { icon: 'mdi-information', color: 'info' };
      }
    }
  }
}
</script>