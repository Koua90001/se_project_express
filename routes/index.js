const router  = require ("express").Router();
const clothingItems = require("./clothingItems")
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingItems);
router.use("/createItem", userRouter)
router.use("clothingItem", clothingItems)

module.exports = router;
