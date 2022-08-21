const cardsRoutes = require('express').Router();

const { getCards, createCard, deleteCard } = require('../controllers/cards');

/* Возвращает все карточки */
cardsRoutes.get('/cards', getCards);

/* Создаёт карточку */
cardsRoutes.post('/cards', createCard);

/* Удаляет карточку по идентификатору */
cardsRoutes.delete('/cards/:cardId', deleteCard);

module.exports = cardsRoutes;
