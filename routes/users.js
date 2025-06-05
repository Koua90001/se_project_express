const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUpdateUser } = require("../middlewares/validation");
const authMiddleware = require("../middlewares/auth");

router.get("/me",authMiddleware, getCurrentUser);
router.patch("/me", authMiddleware, validateUpdateUser, updateProfile);

module.exports = router;