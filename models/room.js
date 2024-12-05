const Sequelize = require("sequelize");
const sequelize = require("../configs/db");

const room = sequelize.define("Rooms", {
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    room_id: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    is_one_to_one: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
}, {
    freezeTableName: true,
});

module.exports = room;
