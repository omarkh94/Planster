const express = require('express');
const messageRouter = express.Router()


const {getAllMessages, saveMessage, createMessage} = require('../Controllers/Messages');
const authentication = require('../middleWares/authentication');

messageRouter.get('/',authentication,getAllMessages)
messageRouter.post('/save',authentication,saveMessage)
messageRouter.post('/create',authentication,createMessage)


module.exports = messageRouter