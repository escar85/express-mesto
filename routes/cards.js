const cardsRouter = require('express').Router();
const path = require('path');
const fs = require('fs').promises;

cardsRouter.get('/cards', (req, res) => {
  const filePath = path.resolve('data', 'cards.json');
  fs.readFile(filePath, { encoding: 'utf8' })
  .then(data => JSON.parse(data))
  .then(data => res.send(data))
  .catch(err => {
    console.log(err);
    res.status(500).send({ message: 'Ошибка на сервере'})
  })
});

  module.exports = cardsRouter;
