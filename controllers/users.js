const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ERROR_CODE_400, ERROR_CODE_401, ERROR_CODE_404, ERROR_CODE_500,
} = require('../constants/errorCode');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

const SALT_ROUNDS = 10;
const JWT_SECRET = 'Mz4Abegjn0pIe4cjnTySDcMTj0GcagfJgX1jdIzv3Vy';

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

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => res.status(201).send({ data: user.deletePasswordFromUser() }))
        .catch((error) => {
          if (error.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные для создания пользователя'));
            // res.status(ERROR_CODE_400)
            // eslint-disable-next-line max-len
            //   .send({ message: `Переданы некорректные данные для создания пользователя ${error.message}` });
          } else if (error.name === 'MongoServerError' && error.code === 11000) {
            next(new NotFoundError('Пользователь с таким email уже существует'));
            // eslint-disable-next-line max-len
            // res.status(ERROR_CODE_404).send({ message: 'Пользователь с таким email уже существует' });
          } else {
            next(error);
            // res.status(ERROR_CODE_500).send({ message: 'Internal server error' });
          }
        });
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

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) res.status(ERROR_CODE_400).send({ message: 'Email или пароль не могут быть пустыми' });
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) res.status(ERROR_CODE_401).send({ message: 'Неверная почта или пароль' });

      return bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) res.status(ERROR_CODE_401).send({ message: 'Неверная почта или пароль' });

          const token = jwt.sign({ _id: user.id }, JWT_SECRET, { expiresIn: '7d' });

          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          })
            .send({ token, user });
        })
        .catch(next);
    });
};

module.exports.getUser = (req, res) => {
  const userId = req.user._id;
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
