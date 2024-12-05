const roomRouter = require('express').Router();

const { createRoom, getRooms, closeRoom } = require('../controllers/room_controller');

const authenticate = require('../middleware/auth');

roomRouter.post('/createroom', authenticate, createRoom);

roomRouter.get('/getrooms', authenticate, getRooms);

roomRouter.put('/closeroom/:id', authenticate, closeRoom);

module.exports = roomRouter;
