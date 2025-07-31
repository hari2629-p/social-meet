const { DataTypes } = require("sequelize");
const db = require("../configs/db");

const Room = db.define("Room", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  room_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  is_one_to_one: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Room;
