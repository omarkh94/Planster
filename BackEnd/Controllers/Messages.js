const mongoose = require('mongoose'); // Import mongoose here
const Message = require("../models/MessageSchema"); // Assuming your Message model is defined here

const saveMessage = async (req, res) => {
  const { senderId, roomId, content, mentions, replyTo } = req.body;
  
  console.log("Received senderId:", senderId);
  console.log("Decoded Token:", req.token);
  
  // Further checks or fetching data based on senderId, roomId, etc.
  
  if (!senderId || !isValidSender(senderId)) {
      console.log("Invalid senderId:", senderId);
      return res.status(400).json({ error: "Invalid senderId" });
  }
  try {
    // Debugging: Log the input data to see if it's coming in correctly
    console.log("saveMessage called with:", {
      content,
      senderId,
      roomId,
      mentions,
      replyTo
    });

    // Check if senderId and roomId are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      console.error("Invalid senderId:", senderId);
      throw new Error("Invalid senderId");
    }
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      console.error("Invalid roomId:", roomId);
      throw new Error("Invalid roomId");
    }

    // Prepare the message object
    const newMessage = new Message({
      content,
      sender: mongoose.Types.ObjectId(senderId),  // Convert senderId to ObjectId
      chatRoomId: mongoose.Types.ObjectId(roomId),  // Convert roomId to ObjectId
      mentions: mentions.map((mention) => mongoose.Types.ObjectId(mention)), // Convert mentions to ObjectIds
      replyTo: replyTo ? mongoose.Types.ObjectId(replyTo) : null, // Convert replyTo to ObjectId if available
    });

    console.log("Message object prepared:", newMessage);  // Log the new message object to check

    // Save to the database
    const savedMessage = await newMessage.save();
    console.log("Message saved successfully:", savedMessage);  // Log the saved message to check

    return savedMessage;
  } catch (error) {
    // Log the error to help debug
    console.error("Error in saveMessage:", error);
    throw new Error("Error saving message");
  }
};

const createMessage = async (req, res) => {
  try {
    const { content, roomId, mentions, replyTo } = req.body;
    const senderId = req.token.userId;

    // Debugging: Log the incoming request data
    console.log("createMessage called with:", { content, roomId, mentions, replyTo, senderId });

    // Call the saveMessage function
    const message = await saveMessage(content, senderId, roomId, mentions, replyTo);

    res.status(200).json({
      success: true,
      message: "Message created successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({
      success: false,
      message: "Error saving message",
      error: error.message,
    });
  }
};

const getAllMessages = async (req, res) => {
  const projectId = req.token.ProjectId;
  try {
    // Use the correct Message model here
    const result = await Message.find({ chatRoomId: projectId }).limit(100);
    res
      .status(200)
      .json({ success: true, message: "Here are all messages", result });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "server error", error: error.message });
  }
};

module.exports = { getAllMessages, saveMessage, createMessage };
