const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'Must be at least 2, got {VALUE}'],
    maxlength: [30, 'Must be not more then 30, got {VALUE}'],
  },
  about: {
    type: String,
    required: [true, 'Поле "about" должно быть заполнено'],
    minlength: [2, 'Must be at least 2, got {VALUE}'],
    maxlength: [30, 'Must be not more then 30, got {VALUE}'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле "avatar" должно быть заполнено'],
  },
});

module.exports = mongoose.model('user', userSchema);
