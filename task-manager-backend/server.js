const express = require('express');
const mongoose = require('./config/mongoConnection');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:3000' })); // Habilitar CORS solo para el origen especificado
app.use(express.json());
app.use('/api', taskRoutes);

mongoose.connection.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

