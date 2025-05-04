const { BAD_REQUEST_ERROR } = require("../errors");
const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      res.status(DEFAULT).send({ message: 'An error has occurred on the server' });
    });
};
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid data' });
      }
      res.status(DEFAULT).send({ message: 'An error has occurred on the server' });
    });
};
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND_ERROR).send({ message: 'User not found' });
      }
      if (err.name === "CastError") {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid data' });
      }
      res.status(DEFAULT).send({ message: 'An error has occurred on the server' });
    });
};
module.exports = { getUsers, createUser, getUser };

