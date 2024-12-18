// const Sequelize = require("sequelize");

// const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     dialect: "postgres",
// });

// module.exports = db;


const Sequelize = require("sequelize");

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql", // Changed from "postgres" to "mysql"
    port: process.env.DB_PORT || 3306, // Use the default MySQL port if not specified
});

module.exports = db;


db.authenticate()
  .then(() => console.log('Connection to MySQL successful!'))
  .catch(err => console.error('Connection to MySQL failed:', err));