const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    elapsedTime: { type: Number, default: 0 }, 
    isRunning: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
}, { timestamps: true });

const Task = mongoose.model('TASK', taskSchema);

module.exports = Task;
