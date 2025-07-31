const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

router.post("/", roomController.createRoom);
router.get("/", roomController.getAllRooms);
router.patch("/close/:id", roomController.closeRoom);

module.exports = router;
