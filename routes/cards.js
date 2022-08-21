const cardsRoutes = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
} = require('../controllers/cards');

/* Возвращает все карточки */
cardsRoutes.get('/cards', getCards);

/* Создаёт карточку */
cardsRoutes.post('/cards', createCard);

/* Удаляет карточку по идентификатору */
cardsRoutes.delete('/cards/:cardId', deleteCard);

/* Поставить лайк карточке */
cardsRoutes.put('/cards/:cardId/likes', likeCard);

module.exports = cardsRoutes;
