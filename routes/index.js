const router  = require ("express").Router();
const clothingItems = require("./clothingItems")
const { login, createUser } = require("../controllers/users");
const userRouter = require("./users");
const { NOT_FOUND_ERROR } = require("../errors");

router.use("/users", userRouter);
router.use("/items", clothingItems);

router.post("/signin", login);
router.post("/signup", createUser);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'User not found' });
});

module.exports = router;
