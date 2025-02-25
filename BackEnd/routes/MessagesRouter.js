const express = require('express');
const messageRouter = express.Router();
const { 
  getAllMessages, 
  createMessage, 
  getMessagesByTeamId, 
  addReply, 
  addMention 
} = require('../Controllers/Messages');
const authentication = require('../middleWares/authentication');

messageRouter.use(authentication); // Apply authentication middleware to all routes

messageRouter.get('/:teamId', getAllMessages);
messageRouter.post('/create', createMessage);
messageRouter.post('/:messageId/reply', addReply);
messageRouter.post('/:messageId/mention', addMention);

module.exports = messageRouter;