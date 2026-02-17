// src/services/taskService.js (o el nombre que tenga tu archivo)
import api from '@/api/axios';

export async function fetchTasks() {
    // Axios ya sabe que la base es /api y ya puso el header
    const { data } = await api.get('/'); 
    return data;
}

export async function createTask(task) {
    // Axios hace el JSON.stringify automáticamente
    const { data } = await api.post('/', task);
    return data;
}

export async function startTask(id) {
    const { data } = await api.post(`/${id}/start`);
    return data;
}

export async function stopTask(id) {
    const { data } = await api.post(`/${id}/stop`);
    return data;
}

export async function updateTask(id, task) {
    const { data } = await api.patch(`/${id}`, task);
    return data;
}

export async function deleteTask(id) {
    await api.delete(`/${id}`);
}

export async function getTaskStats() {
    const { data } = await api.get('/stats');
    return data;
}