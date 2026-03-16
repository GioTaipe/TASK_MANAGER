const express = require('express');
require("dotenv").config();
const app = express();
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes'); 

app.use(cors({
  origin: [
    'https://task-manager.up.railway.app',
    'https://task-manager.up.railway.app/api',
    'https://task-manager-2-wvfr.onrender.com'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'x-device-id'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
app.use('/api', taskRoutes);

module.exports = app;