const jwt = require('jsonwebtoken');

const JWT_SECRET = 'Mz4Abegjn0pIe4cjnTySDcMTj0GcagfJgX1jdIzv3Vy';
const {
  ERROR_CODE_401,
} = require('../constants/errorCode');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(ERROR_CODE_401).send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(ERROR_CODE_401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
