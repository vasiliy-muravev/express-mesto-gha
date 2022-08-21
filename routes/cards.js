const cardsRoutes = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

/* Возвращает все карточки */
cardsRoutes.get('/', getCards);

/* Создаёт карточку */
cardsRoutes.post('/', createCard);

/* Удаляет карточку по идентификатору */
cardsRoutes.delete('/:cardId', deleteCard);

/* Поставить лайк карточке */
cardsRoutes.put('/:cardId/likes', likeCard);

/* Убрать лайк с карточки  */
cardsRoutes.delete('/:cardId/likes', dislikeCard);

module.exports = cardsRoutes;
