const Task = require('../models/Task');

const getAllTasks = async (deviceId) => {
    // Filtramos para que NO devuelva las tareas de otros dispositivos
    return await Task.find({ deviceId }); 
};

const createTask = async (taskData) => {
    const newTask = new Task(taskData);
    console.log(newTask);
    
    return await newTask.save();
};

const deleteTask = async (id, deviceId) => {
    console.log(`Eliminando tarea con ID: ${id} para dispositivo: ${deviceId}`);
    
    return await Task.findByIdAndDelete({_id: id, deviceId: deviceId});
};

const updateTask = async (taskData) => {
    return await Task.findByIdAndUpdate(taskData.id, taskData, { new: true });
};

const startTask = async (taskData) => {
    // Validar que no haya otra tarea corriendo del mismo dispositivo
    
    const activeTask = await Task.findOne({ deviceId:taskData.deviceId  ,isRunning: true });
    
    if (activeTask) {
        throw new Error('Ya hay una tarea activa. Detenla antes de iniciar otra.');
    }

    const task = await Task.findById({_id: taskData.id, deviceId: taskData.deviceId});
    
    if (!task) throw new Error('Tarea no encontrada');

    // 2. Seteamos isRunning y grabamos el momento de inicio
    task.isRunning = true;
    task.startTime = Date.now(); 
    
    return await task.save();
};

const stopTask = async (taskId, deviceId) => {
    const task = await Task.findOne({ _id: taskId, deviceId: deviceId });

    if (!task || !task.isRunning) {
        throw new Error('La tarea no existe o no está en ejecución.');
    }

    const endTime = Date.now();
    const sessionDuration = endTime - (task.startTime || endTime);
    
    task.isRunning = false;
    task.elapsedTime += sessionDuration;
    task.completed = true;
    task.startTime = null;

    // BUSCAR DUPLICADO: 
    // Ahora incluimos 'isPomodoro' en el filtro. 
    // Solo fusionamos si son del mismo tipo y mismo título.
    const duplicatedTask = await Task.findOne({ 
        _id: { $ne: taskId }, 
        title: { $regex: new RegExp(`^${task.title}$`, 'i') }, 
        deviceId: deviceId,
        completed: true,
        isPomodoro: task.isPomodoro // <--- CLAVE
    });

    if (duplicatedTask) {
        duplicatedTask.elapsedTime += task.elapsedTime;
        await duplicatedTask.save();
        await Task.findOneAndDelete({ _id: taskId, deviceId });
        return duplicatedTask;
    }

    return await task.save();
};
const getStatistics = async (deviceId) => {
    const tasks = await Task.find({ 
        deviceId: deviceId, 
        completed: true 
    });

    const stats = {
        totalTime: 0,
        pomodoroCount: 0,
        cronometerTime: 0,
        pomodoroTime: 0,
        tasksPerDay: {} 
    };

    tasks.forEach(task => {
        stats.totalTime += task.elapsedTime;
        
        if (task.isPomodoro) {
            stats.pomodoroCount++;
            stats.pomodoroTime += task.elapsedTime;
        } else {
            stats.cronometerTime += task.elapsedTime;
        }

        // Agrupar por fecha usando updatedAt
        const date = task.updatedAt.toISOString().split('T')[0];
        stats.tasksPerDay[date] = (stats.tasksPerDay[date] || 0) + task.elapsedTime;
    });

    return stats;
};

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    startTask,
    stopTask,
    getStatistics
};