const express = require('express');
const cors = require('cors');

const segmentsRoutes = require('./routes/segments');
const usersRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/segments', segmentsRoutes);
app.use('/api/users', usersRoutes);

module.exports = app;
