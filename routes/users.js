const usersRouter = require('express').Router();
const path = require('path');
const fs = require('fs').promises;
const users = require('../data/users.json');

const filePath = path.resolve('data', 'users.json');

fs.readFile(filePath, { encoding: 'utf8' })
  .then(data => JSON.parse(data))
  .then(data => usersRouter.get('/users', (req, res) => {
    res.send(data);
  }))
  .catch(err => console.log(err));

const doesUserExist = (req, res, next) => {
  const isUserId = users.some((user) => user._id == req.params.id);

  if (!isUserId) {
    res.status(404).send({message: '«Нет пользователя с таким id»'});
    return;
  }

  next();
};

const sendUser = (req, res, next) => {
  res.send(users.find(user => user._id == req.params.id))
}

usersRouter.get('/users/:id', doesUserExist);
usersRouter.get('/users/:id', sendUser);

module.exports = usersRouter;