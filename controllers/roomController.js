const Room = require("../models/room");
const { v1: uuidv1 } = require("uuid");

// Create a room
exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create({
      email: req.body.email,
      room_id: uuidv1(),
      is_one_to_one: req.body.is_one_to_one,
    });

    const room_url = `https://meet.socialnetworkingz.online/${room.room_id}` +
      (room.is_one_to_one ? "?config.minParticipants=2" : "");

    res.status(201).json({
      success: true,
      message: "Room created",
      room_url,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.status(200).json({ success: true, rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Close a room
exports.closeRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ where: { room_id: req.params.id } });
    if (!room) return res.status(404).json({ success: false, message: "Room not found" });

    room.status = false;
    await room.save();

    res.status(200).json({ success: true, message: "Room closed", room });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
