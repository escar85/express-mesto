const express = require('express');
const router = require('./routes');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});

app.use((req, res, next) => {
  req.user = {
    _id: '5f7c68c676e85323e8e836d3'
  };

  next();
});

app.use(express.json());

app.use(router);

app.all('*', (req, res) => {
  res.status(404).send({ message: '«Запрашиваемый ресурс не найден»' });
});