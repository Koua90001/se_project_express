const router  = require ("express").Router();
const { createItem, getItems, updateItem, deleteItem } = require("../controllers/clothingItems");


router.get("/", () => console.log("GET items"));
router.delete("/:itemId", () => console.log("DELETE items by ID"));
router.post("/", () => console.log("POST items"));
router.post("/", createItem);
router.get("/", getItems);
router.put("/:itemId", updateItem)
router.delete("/:itemId", deleteItem)


module.exports = router;
