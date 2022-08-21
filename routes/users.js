const usersRoutes = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

/* Возвращает всех пользователей */
usersRoutes.get('/users', getUsers);

/* Возвращает пользователя по _id */
usersRoutes.get('/users/:userId', getUserById);

/* Создаёт пользователя */
usersRoutes.post('/users', createUser);

/* Обновляет профиль */
usersRoutes.patch('/users/me', updateUser);

/* Обновляет профиль */
usersRoutes.patch('/users/me/avatar', updateUserAvatar);

module.exports = usersRoutes;
