const cardsRouter = require('express').Router();
const path = require('path');
const fs = require('fs').promises;

const filePath = path.resolve('data', 'cards.json');

fs.readFile(filePath, { encoding: 'utf8' })
  .then(data => JSON.parse(data))
  .then(data => cardsRouter.get('/cards', (req, res) => {
    res.send(data);
  }))
  .catch(err => console.log(err));

  module.exports = cardsRouter;
