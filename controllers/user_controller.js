
const User = require("../models/user");

exports.createuser = async (req, res) => {
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
        });

        res.status(201).json({
            success: true,
            message: "User created",
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        res.status(200).json({
            success: true,
            users,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.params.id
            }
        });

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//get paginated users
exports.getPaginatedUsers = async (req, res) => {
    try {
        const page = req.query.page;
        const limit = req.query.limit;

        const users = await User.findAndCountAll({
            limit: limit,
            offset: (page - 1) * limit
        });

        res.status(200).json({
            success: true,
            users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.params.id
            }
        });

        await user.destroy();

        res.status(200).json({
            success: true,
            message: "User deleted"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
