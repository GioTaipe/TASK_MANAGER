const taskService = require('../services/taskService');

exports.getTasks = async (req, res) => {
    try {
        // Pasamos el deviceId inyectado por el middleware al servicio
        const tasks = await taskService.getAllTasks(req.deviceId);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || title.trim() === "") {
            return res.status(400).json({ 
                message: "El título es obligatorio" 
            });
        }

        const deviceId = req.headers['x-device-id']; // Obtenemos el deviceId del header
        const taskData = { ...req.body, deviceId };
        
        const newTask = await taskService.createTask(taskData);

        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.startTask = async (req, res) => {
    try {
        const deviceId = req.headers['x-device-id']; // Obtenemos el deviceId del header
        const id = req.params.id; 
        const taskData = {id, deviceId}; 
        
        const taskStarted = await taskService.startTask(taskData);
        
        res.json({ message: 'Task started successfully', taskData });
    } catch (error) {
        // Diferenciamos errores de "no encontrado" vs "regla de negocio"
        const status = error.message === 'Task not found' ? 404 : 400;
        res.status(status).json({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const deviceId = req.headers['x-device-id']; 
        const taskData = { ...req.body, deviceId }; 
        const task = await taskService.updateTask(taskData);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task updated successfully', taskData });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.stopTask = async (req, res) => {
    try {
        const deviceId = req.headers['x-device-id']; 
        const id = req.params.id; 
        const task = await taskService.stopTask(id, deviceId);
        res.json({ message: 'Tarea detenida y tiempo guardado', task});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const deviceId = req.headers['x-device-id'];
        const taskData = req.params.id; 
        const task = await taskService.deleteTask(taskData, deviceId);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted successfully', task });
        console.log('Eliminado');
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

exports.getStats = async (req, res) => {
    try {
        // Extraemos el deviceId que inyectó middleware de auth
        const deviceId = req.deviceId;

        // Llamamos a la lógica del servicio
        const stats = await taskService.getStatistics(deviceId);

        // Respondemos al cliente
        res.json(stats);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al calcular las estadísticas", 
            error: error.message 
        });
    }
};
