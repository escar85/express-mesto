const express = require('express');
const path = require('path');
const router = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(router);

app.all('*', (req, res) => {
  res.status(404).send({ message: '«Запрашиваемый ресурс не найден»' });
});