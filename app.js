const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const db = require("./configs/db");
const cors = require("cors");
const path = require("path");

const { createuser } = require("./controllers/user_controller");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    createuser();
    res.send("Hello from social networkingz server!");
});

app.use("/v1", require("./routes/user_routes"));
app.use("/v1", require("./routes/room_routes"));

const port = process.env.PORT;

db.sync({ force: false }).then(() => {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
});
