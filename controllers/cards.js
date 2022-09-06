const Card = require('../models/card');
const { ERROR_CODE_404 } = require('../constants/errorCode');
const ForbiddenError = require('../errors/forbidden-err');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((error) => next(error));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError(`Переданы некорректные данные для создания карточки ${error.message}`));
      } else {
        next(error);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(() => new NotFoundError('Карточка с указанным id не существует'))
    .then((card) => {
      if (card && req.user._id !== card.owner.toString()) {
        next(new ForbiddenError('Нельзя удалить карточку другого пользователя'));
      } else {
        Card.findByIdAndDelete(cardId)
          .then((deletedCard) => res.send({ data: deletedCard }))
          .catch((error) => {
            if (error.name === 'CastError') {
              next(new BadRequestError('Удаление карточки с некорректным id'));
            } else {
              next(error);
            }
          });
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Добавление лайка с некорректным id карточки'));
      } else if (error.statusCode === ERROR_CODE_404) {
        next(new NotFoundError('Добавление лайка с несуществующим в БД id карточки'));
      } else {
        next(error);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const error = new Error();
      error.statusCode = ERROR_CODE_404;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Удаление лайка с некорректным id карточки'));
      } else if (error.statusCode === ERROR_CODE_404) {
        next(new NotFoundError('Удаление лайка с несуществующим в БД id карточки'));
      } else {
        next(error);
      }
    });
};
