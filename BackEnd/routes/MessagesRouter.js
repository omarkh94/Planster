const express = require('express');
const { sendMessage, getAllMessages, getMessagesByRoom } = require('../Controllers/Messages');
const MessageRouter = express.Router();


MessageRouter.post('/send', sendMessage);


MessageRouter.get('/:teamId/messages', getAllMessages);


MessageRouter.get('/room/:roomId/messages', getMessagesByRoom);

module.exports = MessageRouter;
