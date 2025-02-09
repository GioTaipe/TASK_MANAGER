require('dotenv').config();
const mongoose = require('mongoose');

const mongoDBCredentials = process.env.CREDENTIALS_MONGO;
const databaseName = process.env.DATABASE_NAME;

const connectionString = `${mongoDBCredentials}/${databaseName}`;

mongoose.connect(connectionString)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

module.exports = mongoose;
