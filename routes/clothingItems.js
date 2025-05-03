const router  = require ("express").Router();
const {
  createItem,
  getItems,
  likeClothingItem,
  unlikeClothingItem,
  updateItem,
  deleteItem } = require("../controllers/clothingItem");



  
router.post("/", createItem);
router.get("/", getItems);
router.delete("/:itemId", () => console.log("DELETE items by ID"));
router.put("/:itemId", updateItem)
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeClothingItem);
router.delete("/:itemId/likes", unlikeClothingItem);





module.exports = router;
