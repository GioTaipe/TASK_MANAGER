const API_URL = 'http://localhost:3001/api';

export async function fetchTasks() {
  const response = await fetch(`${API_URL}/`);
  return await response.json();
}

export async function createTask(task) {
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  return await response.json();
}

export async function updateTask(id, task) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  return await response.json();
}

export async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
}

export async function startTask(id) {
  await fetch(`${API_URL}/${id}/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function stopTask(id, elapsedTime) {
  await fetch(`${API_URL}/${id}/stop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ elapsedTime }),
  });
}
