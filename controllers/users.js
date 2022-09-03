const User = require('../models/user');
const { ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500 } = require('../constants/errorCode');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Internal server error' }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error();
      error.statusCode = ERROR_CODE_404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(ERROR_CODE_400).send({ message: 'Получение пользователя с некорректным id' });
      } else if (error.statusCode === ERROR_CODE_404) {
        res.status(error.statusCode).send({ message: 'Получение пользователя с несуществующим в БД id' });
      } else {
        res.status(ERROR_CODE_500).send({ message: 'Internal server error' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.create({
    name, about, avatar, email, password,
  })
    .then((user) => res.status(201).send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_CODE_400)
          .send({ message: `Переданы некорректные данные для создания пользователя ${error.message}` });
      } else if (error.name === 'MongoServerError' && error.code === 11000) {
        res.status(ERROR_CODE_404).send({ message: 'Пользователь с таким email уже существует' });
      } else {
        res.status(ERROR_CODE_500).send({ message: 'Internal server error' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error();
      error.statusCode = ERROR_CODE_404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_CODE_400)
          .send({ message: `Переданы некорректные данные для изменения данных пользователя ${error.message}` });
      } else if (error.statusCode === ERROR_CODE_404) {
        res.status(error.statusCode).send({ message: 'Получение пользователя с несуществующим в БД id' });
      } else {
        res.status(ERROR_CODE_500).send({ message: 'Internal server error' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error();
      error.statusCode = ERROR_CODE_404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_CODE_400)
          .send({ message: `Переданы некорректные данные для обновления аватара ${error.message}` });
      } else if (error.statusCode === ERROR_CODE_404) {
        res.status(ERROR_CODE_404).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(ERROR_CODE_500).send({ message: 'Internal server error' });
      }
    });
};
