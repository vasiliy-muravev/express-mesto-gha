const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((error) => res.status(500).send({ message: `Internal server error ${error}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: `Переданы некорректные данные для создания карточки ${error}` });
      } else {
        res.status(500).send({ message: `Internal server error ${error}` });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .orFail(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: `Удаление карточки с некорректным id ${error}` });
      } else if (error.statusCode === 404) {
        res.status(error.statusCode).send({ message: `Удаление карточки с несуществующим в БД id ${error}` });
      } else {
        res.status(500).send({ message: `Internal server error ${error}` });
      }
    });
};
