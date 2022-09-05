const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { ERROR_CODE_404 } = require('./constants/errorCode');

const app = express();
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const login = require('./routes/users');
const createUser = require('./routes/users');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use((err, req, res) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.use((req, res) => {
  res.status(ERROR_CODE_404).send({ message: 'Страница по указанному маршруту не найдена' });
});

app.listen(3000);
