require('dotenv').config();
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const taskRoutes = require('../routes/taskRoutes');

const app = express();
mongoose.set('strictQuery', false);

const mongoDBCredentials = process.env.CREDENTIALS_MONGO;
if (!mongoDBCredentials) {
    throw new Error("CREDENTIALS_MONGO is not defined in environment variables");
}

app.use(express.json());
app.use('/tasks', taskRoutes);

beforeAll(async () => {
    await mongoose.connect(mongoDBCredentials);
});

afterAll(async () => {
    await mongoose.connection.close(true);
});

beforeEach(async () => {
    await Task.deleteMany();
});

test('should create a new task', async () => {
    const response = await request(app)
        .post('/tasks')
        .send({
            title: "Test Task",
            description: "This is a test task"
        })
        .expect(201);

    expect(response.body.title).toBe('Test Task');
    expect(response.body.description).toBe('This is a test task');
    expect(response.body.elapsedTime).toBe(0);
    expect(response.body.isRunning).toBe(false);
    expect(response.body.completed).toBe(false);
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
});

test('should get all tasks', async () => {
    await Task.create({ title: 'Test Task', description: 'This is a test task' });

    const response = await request(app)
        .get('/tasks')
        .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe('Test Task');
    expect(response.body[0].description).toBe('This is a test task');
    expect(response.body[0].elapsedTime).toBe(0);
    expect(response.body[0].isRunning).toBe(false);
    expect(response.body[0].completed).toBe(false);
});

test('should update a task', async () => {
    const task = await Task.create({ title: 'Test Task', description: 'This is a test task' });

    const response = await request(app)
        .patch(`/tasks/${task._id}`)
        .send({ title: 'Updated Task', description: 'Updated description', isRunning: true })
        .expect(200);

    expect(response.body.title).toBe('Updated Task');
    expect(response.body.description).toBe('Updated description');
    expect(response.body.isRunning).toBe(true);
    expect(response.body.elapsedTime).toBe(0);  
    expect(response.body.completed).toBe(false);
});

test('should delete a task', async () => {
    const task = await Task.create({ title: 'Test Task', description: 'This is a test task' });

    await request(app)
        .delete(`/tasks/${task._id}`)
        .expect(200);

    const taskInDb = await Task.findById(task._id);
    expect(taskInDb).toBeNull();
});
