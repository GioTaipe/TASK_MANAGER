const express = require('express');
const app = express();
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes'); 


app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  allowedHeaders: ['Content-Type', 'x-device-id'], // Header personalizado para el deviceId
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use('/api', taskRoutes);

module.exports = app;