const mongoose = require('mongoose');

// Definimos el esquema de la tarea, incluyendo el deviceId para asociar tareas a dispositivos específicos
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    deviceId: { type: String, required: true, index: true },
    isRunning: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    startTime: { type: Date },
    elapsedTime: { type: Number, default: 0 },
    // Campos para funcionalidad de Pomodoro
    isPomodoro: { type: Boolean, default: false },
    totalPomodoroTime: { type: Number, default: 0 } // Tiempo total elegido (ej: 25 min)
}, { timestamps: true });

const Task = mongoose.model('TASK', taskSchema);

module.exports = Task;
