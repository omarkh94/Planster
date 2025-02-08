const mongoose = require('mongoose'); 
const Message = require("../models/MessageSchema"); 
const saveMessage = (req, res) => {
  const { content ,  senderId , chatRoomId ,  mentions , replyTo } = req.body;

  const messageData = {
    senderId: senderId ? new mongoose.Types.ObjectId(senderId) : undefined,
    chatRoomId: chatRoomId ? new mongoose.Types.ObjectId(chatRoomId) : undefined,
    content: content || "", 
    mentions: mentions || [] ,
    replyTo: replyTo || []
  };

  const message = new Message(messageData);

  message.save()
    .then(savedMessage => {
      res.status(200).send(savedMessage);  
    })
    .catch(error => {
      console.error("Error in saveMessage:", error);
      res.status(500).send({ error: "Error while saving messages" });
    });
};

const createMessage = async (req, res) => {
  try {
    const { content, chatRoomId, mentions, replyTo } = req.body;
    const senderId = req.user ? req.user.userId : null; 

    if (!senderId) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const message = await saveMessage(req, res);

    return res.status(200).json({
      success: true,
      message: "Message created successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error creating message:", error);
    return res.status(500).json({
      success: false,
      message: "Error saving message",
      error: error.message,
    });
  }
};

const getAllMessages = async (req, res) => {
  const projectId = req.token.ProjectId; 

  try {
    const result = await Message.find({ chatchatRoomId: projectId }).limit(100);
    res
      .status(200)
      .json({ success: true, message: "Here are all messages", result });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getMessagesByRoomId = async (chatRoomId) => {
  try {
    const messages = await Message.find({ chatRoomId: chatRoomId })
      .populate("sender", "name") 
      .populate("mentions", "name") 
      .populate("replies", "content sender") 
      .sort({ timestamp: 1 }) 
      .lean();
    return messages;
  } catch (error) {
    console.error("❌ : Error fetching messages", error);
    return [];
  }
};


module.exports = { getAllMessages, saveMessage, createMessage, getMessagesByRoomId };
