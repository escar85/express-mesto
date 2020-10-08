const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then(data => res.send(data))
    .catch(err => {
      console.log(err);
      res.status(500).send({ message: 'Ошибка на сервере' })
    })
}

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'CastError') return res.status(404).send({ message: 'Пользователь с таким id отсутствует' })
      console.log(err);
      res.status(500).send({ message: 'Ошибка на сервере' })
    })
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Ошибка валидации. Проверьте введенные данные.' })
      console.log(err);
      res.status(500).send({ message: 'Ошибка на сервере' })
    })
}

const updateProfile = (req, res) => {
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
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Ошибка валидации. Проверьте введенные данные.' })
      console.log(err);
      res.status(500).send({ message: 'Ошибка на сервере' })
    })
}

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar: avatar }, {
    new: true,
    runValidators: true
  })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Ошибка валидации. Проверьте введенные данные.' })
      console.log(err);
      res.status(500).send({ message: 'Ошибка на сервере' })
    })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar
}