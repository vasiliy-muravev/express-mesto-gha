const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Must be at least 2, got {VALUE}'],
    maxlength: [30, 'Must be not more then 30, got {VALUE}'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Must be at least 2, got {VALUE}'],
    maxlength: [30, 'Must be not more then 30, got {VALUE}'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: [true, 'Поле "email" должно быть уникально'],
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Неправильный формат email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    select: false,
  },
});

function deletePasswordFromUser() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}
userSchema.methods.deletePasswordFromUser = deletePasswordFromUser;

module.exports = mongoose.model('user', userSchema);
