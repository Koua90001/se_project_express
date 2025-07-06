const express = require("express");
const router = express.Router();

const clothingItems = require("./clothingItems");
const userRouter = require("./users");

const { login, createUser } = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");
const { NOT_FOUND_ERROR } = require("../errors");
const { validateLogin, validateUserInfo } = require("../middlewares/validation");
const NotFoundError = require("../utils/errors/NotFoundError");

router.post("/signin", validateLogin, login);
router.post("/signup", validateUserInfo, createUser);



router.use("/users", userRouter);
router.use("/items", clothingItems);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
