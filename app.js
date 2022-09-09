const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const app = express();
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const login = require('./routes/users');
const createUser = require('./routes/users');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
/* Логгер запросов winston */
app.use(requestLogger);
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);
app.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});
app.use((req, res, next) => {
  next(new NotFoundError('Страница по указанному маршруту не найдена'));
});
/* Логгер ошибок winston */
app.use(errorLogger);
/* Обработчик валидации от celebrate */
app.use(errors());
/* Кастомый обработчик ошибок */
app.use(error);

app.listen(3000);
