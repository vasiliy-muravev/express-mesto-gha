const usersRoutes = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

/* Возвращает всех пользователей */
usersRoutes.get('/', getUsers);

/* Возвращает пользователя по _id */
usersRoutes.get('/:userId', getUserById);

/* Создаёт пользователя */
usersRoutes.post('/', createUser);

/* Обновляет профиль */
usersRoutes.patch('/me', updateUser);

/* Обновляет профиль */
usersRoutes.patch('/me/avatar', updateUserAvatar);

module.exports = usersRoutes;
