const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../middlewares/errors/not-found-error');
const WrongInputDataError = require('../middlewares/errors/wrong-input-data-error');
const WrongCredentialsError = require('../middlewares/errors/wrong-credentials-error');
const MongoError = require('../middlewares/errors/mongo-error');

const getUsers = (req, res, next) => {
  User.find({})
    .then(data => res.send(data))
    .catch(next)
}

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'CastError') return new NotFoundError('Пользователь с таким id отсутствует')
      console.log(err);
    })
    .catch(next)
}

const createUser = (req, res, next) => {

  // bcrypt.hash хэшируем пароль, добавляем соль "10"
  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({
      email: req.body.email,
      password: hash
    }, {
      new: true,
      runValidators: true,
      upsert: true
    }))

    .catch(err => {
      console.log(err)
      if (err.name === 'ValidationError') {
        throw new WrongInputDataError('Ошибка валидации. Проверьте введенные данные.')
      } else if (err.name === 'MongoError' || err.code === 11000) {
        throw new MongoError('Пользователь с таким E-Mail уже зарегистрирован')
      }
    })
    .then((user) => {
      const newUser = user;
      newUser.password = '';
      res.send({ data: newUser });
    })
    .catch(next);
}

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, {
    name: name,
    about: about
  }, {
    new: true,
    runValidators: true
  })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'ValidationError') return new WrongInputDataError('Ошибка валидации. Проверьте введенные данные.')
      console.log(err);
    })
    .catch(next);
}

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar: avatar }, {
    new: true,
    runValidators: true
  })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'ValidationError') return new WrongInputDataError('Ошибка валидации. Проверьте введенные данные.')
      console.log(err);
    })
    .catch(next);
}

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создаем токен
      const token = jwt.sign({ _id: user._id }, 'f385894f20935f1d2fbeae7c08149367c7c867633e149850056bc3e1149695a1', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
}

const getUserByToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization && !authorization.startsWith('Bearer ')) {
    throw new WrongCredentialsError('Wrong')  //return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'f385894f20935f1d2fbeae7c08149367c7c867633e149850056bc3e1149695a1');
  } catch (err) {
    return new WrongCredentialsError('wrong'); // res.status(401).send({ message: 'Необходима авторизация' });
  }

  User.findById(payload)
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'CastError') return new NotFoundError('Пользователь с таким id отсутствует')
      console.log(err);
    })
    .catch(next)
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getUserByToken
}