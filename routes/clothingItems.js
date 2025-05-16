const router  = require ("express").Router();
const auth = require("../middlewares/auth");
const {
  createItem,
  getItems,
  likeClothingItem,
  unlikeClothingItem,
  deleteItem } = require("../controllers/clothingItem");

  const {
    validateClothingItem,
    validateId,
  } = require("../middlewares/validation");


router.get("/", getItems);

router.use(auth);
router.post("/", createItem);
router.delete("/:itemId",validateId, deleteItem);
router.put("/:itemId/likes",validateId, likeClothingItem);
router.delete("/:itemId/likes",validateId, unlikeClothingItem);





module.exports = router;
