const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((error) => res.status(500).send({ message: `Internal server error ${error}` }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.status(200).send({ data: user }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(500).send({ message: `Internal server error ${error}` });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для создания пользователя' });
      } else {
        res.status(500).send({ message: `Internal server error ${error}` });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(500).send({ message: `Internal server error ${error}` });
      }
    });
};
