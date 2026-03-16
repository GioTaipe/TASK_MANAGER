const express = require('express');
require("dotenv").config();
const app = express();
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes'); 


app.use(express.json());
app.use(cors({
  origin: [
    'https://task-manager.up.railway.app',
    'https://task-manager.up.railway.app/api',
    'https://task-manager-2-wvfr.onrender.com'
  ],
  allowedHeaders: ['Content-Type', 'x-device-id'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use('/api', taskRoutes);

module.exports = app;