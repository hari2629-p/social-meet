const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:email", userController.getUserByEmail);
router.delete("/:email", userController.deleteUserByEmail);

module.exports = router;
