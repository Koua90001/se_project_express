const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { BadRequestError,
  NotFoundError,
   DEFAULT, CONFLICT_ERROR,

   } = require("../errors");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/errors/config");
const { UnauthorizedError } = require("../utils/errors/UnauthorizedError");




const createUser = (req, res, next ) => {
  const { name, avatar, email, password } = req.body;
  if (!email) {
    return next(new BadRequestError("Invalid data Format"));
  }

  return User.findOne({ email })
    .then((matched) => {
      if (matched) {
        const err = new Error("The email already exists!");
        err.code = 11000;
        throw err;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      res
        .status(201)
        .send({ name: user.name, avatar: user.avatar, email: user.email });
    })

    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res.status(CONFLICT_ERROR).send({ message: "Email already in use"});
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      res.status(DEFAULT).send({ message: 'An error has occurred on the server' });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Incorrect email or password provided"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError(err.message));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NotFoundError).send({ message: 'User not found' });
      }
      if (err.name === "CastError") {
       return res.status(BadRequestError).send({ message: 'Invalid data' });
      }
      res.status(DEFAULT).send({ message: 'An error has occurred on the server' });
    });
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user?._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return next(new NotFoundError("User not found"));
      }
      return res.send({ user: updatedUser });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};
module.exports = { createUser, getCurrentUser, login, updateProfile };

