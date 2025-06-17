const express = require("express");
const router = express.Router();

const clothingItems = require("./clothingItems")
const userRouter = require("./users");

const { login, createUser } = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");
const { NOT_FOUND_ERROR } = require("../errors");

router.post("/signin", login);
router.post("/signup", createUser);

router.use(authMiddleware);

router.use("/users", userRouter);
router.use("/items", clothingItems);


router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'User not found' });
});

module.exports = router;
