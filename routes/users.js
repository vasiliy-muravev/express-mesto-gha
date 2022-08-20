const usersRoutes = require('express').Router();

const {getUsers, getUserById, createUser} = require('../controllers/users');

/* Возвращает всех пользователей */
usersRoutes.get('/users', getUsers);

/* Возвращает пользователя по _id*/
usersRoutes.get('/users/:userId', getUserById);

/* Создаёт пользователя */
usersRoutes.post('/users', createUser);

module.exports = usersRoutes;