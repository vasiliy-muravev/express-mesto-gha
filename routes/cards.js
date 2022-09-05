const cardsRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
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
cardsRoutes.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
  }),
}), createCard);

/* Удаляет карточку по идентификатору */
cardsRoutes.delete('/:cardId', deleteCard);

/* Поставить лайк карточке */
cardsRoutes.put('/:cardId/likes', likeCard);

/* Убрать лайк с карточки  */
cardsRoutes.delete('/:cardId/likes', dislikeCard);

module.exports = cardsRoutes;
