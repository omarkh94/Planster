// const mongoose = require('mongoose'); 
// const Message = require("../models/MessageSchema"); 
// const saveMessage = (req, res) => {
//   const { content ,  senderId , chatRoomId ,  mentions , replyTo } = req.body;

//   const messageData = {
//     senderId: senderId ? new mongoose.Types.ObjectId(senderId) : undefined,
//     chatRoomId: chatRoomId ? new mongoose.Types.ObjectId(chatRoomId) : undefined,
//     content: content || "", 
//     mentions: mentions || [] ,
//     replyTo: replyTo || []
//   };

//   const message = new Message(messageData);

//   message.save()
//     .then(savedMessage => {
//       res.status(200).send(savedMessage);  
//     })
//     .catch(error => {
//       console.error("Error in saveMessage:", error);
//       res.status(500).send({ error: "Error while saving messages" });
//     });
// };

// const createMessage = async (req, res) => {
//   try {
//     const { content, chatRoomId, mentions, replyTo } = req.body;
//     const senderId = req.user ? req.user.userId : null; 

//     if (!senderId) {
//       return res.status(400).json({
//         success: false,
//         message: "User not authenticated",
//       });
//     }

//     const message = await saveMessage(req, res);

//     return res.status(200).json({
//       success: true,
//       message: "Message created successfully",
//       data: message,
//     });
//   } catch (error) {
//     console.error("Error creating message:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error saving message",
//       error: error.message,
//     });
//   }
// };

// const getAllMessages = async (req, res) => {
//   const projectId = req.token.ProjectId; 

//   try {
//     const result = await Message.find({ chatchatRoomId: projectId }).limit(100);
//     res
//       .status(200)
//       .json({ success: true, message: "Here are all messages", result });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// };

// const getMessagesByRoomId = async (chatRoomId) => {
//   try {
//     const messages = await Message.find({ chatRoomId: chatRoomId })
//       .populate("sender", "name") 
//       .populate("mentions", "name") 
//       .populate("replies", "content sender") 
//       .sort({ timestamp: 1 }) 
//       .lean();
//     return messages;
//   } catch (error) {
//     console.error("❌ : Error fetching messages", error);
//     return [];
//   }
// };


// module.exports = { getAllMessages, saveMessage, createMessage, getMessagesByRoomId };


const mongoose = require('mongoose');
const Message = require("../models/MessageSchema");
const Team = require("../models/TeamSchema");
const User = require("../models/UserSchema");

const saveMessage = async (messageData) => {
  try {
    const message = new Message(messageData);
    const savedMessage = await message.save();
    return savedMessage;
  } catch (error) {
    console.error("Error in saveMessage:", error);
    throw error;
  }
};

const createMessage = async (req) => {
  try {
    // Add validation
    if (!req.body.teamId) throw new Error("Team ID is required");
    if (!req.body.content?.trim()) throw new Error("Content is required");

    const messageData = {
      content: req.body.content,
      team: req.body.teamId,  // Match schema field name
      sender: req.user._id,
      mentions: req.body.mentions || [],
      replies: []
    };

    return await Message.create(messageData);
  } catch (error) {
    console.error("Error creating message:", error.message);
    throw error;
  }
};

const getAllMessages = async (req, res) => {
  const { teamId } = req.params;

  try {
    const messages = await Message.find({ team: teamId, isDeleted: false })
      .populate('sender', 'firstName lastName')
      .populate('mentions', 'firstName lastName')
      .populate('replies.sender', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ 
      success: true, 
      message: "Messages retrieved successfully", 
      data: messages 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

const getMessagesByTeamId = async (teamId) => {
  try {
    const messages = await Message.find({ team: teamId, isDeleted: false })
      .populate('sender', 'firstName lastName')
      .populate('mentions', 'firstName lastName')
      .populate('replies.sender', 'firstName lastName')
      .sort({ createdAt: 1 })
      .lean();
    return messages;
  } catch (error) {
    console.error("❌ : Error fetching messages", error);
    return [];
  }
};

const addReply = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const senderId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    message.replies.push({ content, sender: senderId });
    await message.save();

    const updatedMessage = await Message.findById(messageId)
      .populate('sender', 'firstName lastName')
      .populate('mentions', 'firstName lastName')
      .populate('replies.sender', 'firstName lastName');

    res.status(200).json({
      success: true,
      message: "Reply added successfully",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({
      success: false,
      message: "Error adding reply",
      error: error.message,
    });
  }
};

const addMention = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { mentionedUserId } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const mentionedUser = await User.findById(mentionedUserId);
    if (!mentionedUser) {
      return res.status(404).json({
        success: false,
        message: "Mentioned user not found",
      });
    }

    if (!message.mentions.includes(mentionedUserId)) {
      message.mentions.push(mentionedUserId);
      await message.save();
    }

    const updatedMessage = await Message.findById(messageId)
      .populate('sender', 'firstName lastName')
      .populate('mentions', 'firstName lastName')
      .populate('replies.sender', 'firstName lastName');

    res.status(200).json({
      success: true,
      message: "Mention added successfully",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Error adding mention:", error);
    res.status(500).json({
      success: false,
      message: "Error adding mention",
      error: error.message,
    });
  }
};

module.exports = { 
  getAllMessages, 
  createMessage, 
  getMessagesByTeamId, 
  addReply, 
  addMention 
};