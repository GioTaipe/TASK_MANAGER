const express = require('express');
require("dotenv").config();
const app = express();
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes'); 


app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001',
  allowedHeaders: ['Content-Type', 'x-device-id'], // Header personalizado para el deviceId
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use('/api', taskRoutes);

module.exports = app;