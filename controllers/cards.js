const Card = require('../models/card');
const { ERROR_CODE_400, ERROR_CODE_404, ERROR_CODE_500 } = require('../constants/errorCode');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Internal server error' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_CODE_400)
          .send({ message: `Переданы некорректные данные для создания карточки ${error.message}` });
      } else {
        res.status(ERROR_CODE_500).send({ message: 'Internal server error' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .orFail(() => {
      const error = new Error();
      error.statusCode = ERROR_CODE_404;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(ERROR_CODE_400).send({ message: 'Удаление карточки с некорректным id' });
      } else if (error.statusCode === ERROR_CODE_404) {
        res.status(error.statusCode).send({ message: 'Удаление карточки с несуществующим в БД id' });
      } else {
        res.status(ERROR_CODE_500).send({ message: 'Internal server error' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
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
        res.status(ERROR_CODE_400).send({ message: 'Добавление лайка с некорректным id карточки' });
      } else if (error.statusCode === ERROR_CODE_404) {
        res.status(error.statusCode).send({ message: 'Добавление лайка с несуществующим в БД id карточки' });
      } else {
        res.status(ERROR_CODE_500).send({ message: 'Internal server error' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
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
        res.status(ERROR_CODE_400).send({ message: 'Удаление лайка с некорректным id карточки' });
      } else if (error.statusCode === ERROR_CODE_404) {
        res.status(error.statusCode).send({ message: 'Удаление лайка с несуществующим в БД id карточки' });
      } else {
        res.status(ERROR_CODE_500).send({ message: 'Internal server error' });
      }
    });
};
