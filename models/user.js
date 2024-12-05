const Sequelize = require("sequelize");
const sequelize = require("../configs/db");

const user = sequelize.define("Users", {
    name: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
    },
}, {
    freezeTableName: true,
});

module.exports = user;
