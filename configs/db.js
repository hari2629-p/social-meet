const { Sequelize } = require("sequelize");

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
  }
);
console.log("Connecting with:", {
  db: process.env.DB_NAME,
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD,
});


db.authenticate()
  .then(() => console.log("✅ MySQL connection successful"))
  .catch((err) => console.error("❌ MySQL connection error:", err));

module.exports = db;
