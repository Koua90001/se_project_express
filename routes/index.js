const router  = require ("express").Router();
const clothingItems = require("./clothingItems")
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingItems);

module.exports = router;
