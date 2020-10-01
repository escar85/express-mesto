const usersRouter = require('express').Router();
const path = require('path');
const fs = require('fs').promises;

const filePath = path.resolve('data', 'users.json');

usersRouter.get('/users', (req, res) => {
  fs.readFile(filePath, { encoding: 'utf8' })
    .then(data => JSON.parse(data))
    .then(data => res.send(data))
    .catch(err => {
      console.log(err);
      res.status(500).send({ message: 'Ошибка на сервере' })
    })
})

const sendUserById = (req, res) => {
  fs.readFile(filePath, { encoding: 'utf8' })
    .then(data => JSON.parse(data))
    .then(users => {
      const user = users.find(user => user._id == req.params.id);

      if (!user) {
        res.status(404).send({ message: '«Нет пользователя с таким id»' });
        return;
      }

      res.send(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ message: 'Ошибка на сервере' })
    })
};

usersRouter.get('/users/:id', sendUserById);

module.exports = usersRouter;