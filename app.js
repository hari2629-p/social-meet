const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const db = require("./configs/db");
const cors = require("cors");
const path = require("path");

// Import controllers and routes
const { createuser } = require("./controllers/user_controller");
const userRoutes = require("./routes/user_routes");
const roomRoutes = require("./routes/room_routes");
const jitsiRoutes = require("./routes/jitsi_routes"); // Add this line

// Middleware
app.use(express.json());  // Add this line to parse JSON requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());  // This can be removed if express.json() is used
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
    createuser();
    res.send("Hello from social networkingz server!");
});

app.use("/v1", userRoutes);
app.use("/v1", roomRoutes);
app.use("/v1/jitsi", jitsiRoutes); // Add this line

// Server Setup
const port = process.env.PORT;

db.sync({ force: false }).then(() => {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
});
