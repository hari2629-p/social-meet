const Rooms = require("../models/room");
const {
    v1: uuidv1,
} = require('uuid');

exports.createRoom = async (req, res) => {
    try {
        const room = await Rooms.create({
            email: req.body.email,
            room_id: uuidv1(),
            status: true,
            is_one_to_one: req.body.is_one_to_one,
        });

        var room_url;

        if (req.body.is_one_to_one) {
            room_url = "https://meet.socialnetworkingz.online/" + room.room_id + "?config.prejoinConfig.enabled=true&config.minParticipants=2";
        } else {
            room_url = "https://meet.socialnetworkingz.online/" + room.room_id + "?config.prejoinConfig.enabled=true";
        }

        res.status(201).json({
            success: true,
            room_url
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getRooms = async (req, res) => {
    try {
        const rooms = await Rooms.findAll();

        res.status(200).json({
            success: true,
            rooms
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getActiveRooms = async (req, res) => {
    try {
        const rooms = await Rooms.findAll({
            where: {
                status: true
            }
        });

        res.status(200).json({
            success: true,
            rooms
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.closeRoom = async (req, res) => {
    try {
        const room = await Rooms.findOne({
            where: {
                room_id: req.params.id
            }
        });

        room.status = false;
        await room.save();

        res.status(200).json({
            success: true,
            room
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
