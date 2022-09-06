const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ERROR_CODE_404 } = require('../constants/errorCode');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');

const SALT_ROUNDS = 10;
const JWT_SECRET = 'Mz4Abegjn0pIe4cjnTySDcMTj0GcagfJgX1jdIzv3Vy';

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((error) => next(error));
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Получение пользователя с некорректным id'));
      } else {
        next(error);
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
            next(new BadRequestError(`Переданы некорректные данные для создания пользователя ${error.message}`));
          } else if (error.name === 'MongoServerError' && error.code === 11000) {
            next(new ConflictError('Пользователь с таким email уже существует'));
          } else {
            next(error);
          }
        });
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError(`Переданы некорректные данные для изменения данных пользователя ${error.message}`));
      } else {
        next(error);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError(`Переданы некорректные данные для обновления аватара ${error.message}`));
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Email или пароль не могут быть пустыми'));
  }
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError('Неверная почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) {
            next(new UnauthorizedError('Неверная почта или пароль'));
          }

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

module.exports.getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Получение пользователя с некорректным id'));
      } else {
        next(error);
      }
    });
};
