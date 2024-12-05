const userRouter = require('express').Router();

const { createuser, getPaginatedUsers, getUser, getUsers, deleteUser } = require("../controllers/user_controller");

const authenticate = require("../middleware/auth");

userRouter.post("/createuser", authenticate, createuser);

userRouter.get("/getuser/:id", authenticate, getUser);

userRouter.get("/getusers", authenticate, getUsers);

userRouter.get("/getpaginatedusers", authenticate, getPaginatedUsers);

userRouter.delete("/deleteuser/:id", authenticate, deleteUser);

module.exports = userRouter;
