const router  = require ("express").Router();
const {
  createItem,
  getItems,
  likeClothingItem,
  unlikeClothingItem,
  updateItem,
  deleteItem } = require("../controllers/clothingItem");



router.delete("/:itemId", () => console.log("DELETE items by ID"));
router.post("/", createItem);
router.put("/:itemId/likes", likeClothingItem);
router.get("/", getItems);
router.put("/:itemId", updateItem)
router.delete("/:itemId", deleteItem);
router.delete("/:itemId/likes", unlikeClothingItem);


module.exports = router;
