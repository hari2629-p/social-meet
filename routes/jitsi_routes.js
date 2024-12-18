const express = require('express');
const router = express.Router();

router.post('/create-meeting', (req, res) => {
    const { roomName } = req.body;
    const meetingURL = `https://meet.jit.si/${roomName || `Room-${Date.now()}`}`;
    res.status(200).json({ meetingURL });
});

module.exports = router;
