// Load environment variables first
require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

// Load database after .env is loaded
const db = require("./configs/db");

// Load route files
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
// const jitsiRoutes = require("./routes/jitsi_routes"); // Uncomment only if this file exists

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Test Route
app.get("/", (req, res) => {
  res.send("👋 Welcome to Social Networkingz Backend Server!");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
// app.use("/api/jitsi", jitsiRoutes); // Uncomment if needed

// Start server
const port = process.env.PORT || 3000;
db.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`✅ Server started on port ${port}`);
  });
});
