const express = require('express');
const mongoose = require('mongoose');
const app = express();
const usersRoutes = require('./routes/users')

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
// mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', usersRoutes);

app.listen(3000);