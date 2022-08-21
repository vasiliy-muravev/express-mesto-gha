const express = require('express');
const mongoose = require('mongoose');
const { ERROR_CODE_404 } = require('./constants/errorCode');

const app = express();
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6301f358d32f17b45a8918b8',
  };

  next();
});

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use((req, res) => {
  res.status(ERROR_CODE_404).send({ message: 'Страница по указанному маршруту не найдена' });
});

app.listen(3000);
