const usersRoutes = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
  getUser,
} = require('../controllers/users');

/* Возвращает всех пользователей */
usersRoutes.get('/', getUsers);

/* Получение информации о пользователе */
usersRoutes.get('/me', getUser);

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
