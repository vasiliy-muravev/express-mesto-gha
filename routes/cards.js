const cardsRoutes = require('express').Router();

const { getCards, createCard, deleteCard } = require('../controllers/cards');

/* Возвращает всех пользователей */
cardsRoutes.get('/cards', getCards);

/* Возвращает пользователя по _id */
cardsRoutes.post('/cards', createCard);

/* Создаёт пользователя */
cardsRoutes.delete('/cards/:cardId', deleteCard);

module.exports = cardsRoutes;
