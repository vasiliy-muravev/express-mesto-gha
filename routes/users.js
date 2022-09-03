const usersRoutes = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
} = require('../controllers/users');

/* Возвращает всех пользователей */
usersRoutes.get('/', getUsers);

/* Возвращает пользователя по _id */
usersRoutes.get('/:userId', getUserById);

/* Обновляет профиль */
usersRoutes.patch('/me', updateUser);

/* Обновляет профиль */
usersRoutes.patch('/me/avatar', updateUserAvatar);

/* Логин */
usersRoutes.post('/signin', login);

/* Регистрация */
usersRoutes.post('/signup', createUser);

module.exports = usersRoutes;
