const express = require('express');
const messageRouter = express.Router()


const { getAllMessages, saveMessage, createMessage, getMessagesByRoomId } = require('../Controllers/Messages');
const authentication = require('../middleWares/authentication');

messageRouter.get('/',authentication,getAllMessages)
messageRouter.post('/save',saveMessage)
messageRouter.post('/create',createMessage)


module.exports = messageRouter