const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Crear una tarea
router.post('/', async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = new Task({ title, description });
        await newTask.save();
        console.log('Task created successfully');
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error });
    }
});

// Obtener todas las tareas
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
});

// Actualizar una tarea
router.patch('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: 'Error updating task', error });
    }
});

// Eliminar una tarea
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
});

// Iniciar una tarea
router.post('/:id/start', async (req, res) => {
    try {
        console.log('Starting task:', req.params.id);
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.isRunning) {
            return res.status(400).json({ message: 'Task is already running' });
        }

        task.isRunning = true;
        await task.save();
        res.json({ message: 'Task started successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Error starting task', error });
    }
});

// Detener una tarea
router.post('/:id/stop', async (req, res) => {
    try {
        console.log('Stopping task:', req.params.id);
        const { elapsedTime } = req.body;

        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (!task.isRunning) {
            return res.status(400).json({ message: 'Task is not running' });
        }

        task.isRunning = false;
        task.elapsedTime += elapsedTime;
        task.completed = true;

        await task.save();
        res.json({ message: 'Task stopped successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Error stopping task', error });
    }
});

module.exports = router;
