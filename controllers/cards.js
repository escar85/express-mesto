const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(err => {
      console.log(err);
      res.status(500).send({ message: 'Ошибка на сервере' })
    })
}

const createCard = (req, res) => {
  const { name, link } = req.body
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch(err => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: 'Ошибка валидации. Проверьте введенные данные.' })
      console.log(err);
      res.status(500).send({ message: 'Ошибка на сервере' })
    })
}

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .catch(err => {
      console.log(err);
      res.status(500).send({ message: 'Ошибка на сервере' })
    })
}

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
  .then(card => res.send({ data: card }))
  .catch(err => {
    console.log(err);
    res.status(500).send({ message: 'Ошибка на сервере' })
  })
}


const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
  .then(card => res.send({ data: card }))
  .catch(err => {
    console.log(err);
    res.status(500).send({ message: 'Ошибка на сервере' })
  })
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}