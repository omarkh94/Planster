const Message = require('../models/MessageSchema'); 
const ChatRoom = require('../models/ChatRoomSchema');
const User = require('../models/UserSchema');
const Team = require('../models/TeamSchema');
const sendMessage = async (req, res) => {
    const { content, userId, mentions = [] } = req.body;

    // Assuming roomId is the same as teamId
    const teamId = req.body.teamId;  // Get teamId from the body
    const roomId = teamId;  // Set roomId equal to teamId

    console.log("🔍 Received Data:", { roomId, content, userId, mentions });

    try {
        // Check if the chat room exists
        let chatRoom = await ChatRoom.findOne({ roomId });

        // If chat room doesn't exist, create it
        if (!chatRoom) {
            console.log("❌ Chat room not found, creating new one...");

            // Convert userId to ObjectId (use 'new')
            const userObjectId = new mongoose.Types.ObjectId(userId);  // Corrected here
            
            const users = [userObjectId];  // Starting with the sender as the first user

            // Create a new chat room with roomId as teamId
            chatRoom = new ChatRoom({
                roomId,  // Set roomId equal to teamId
                users,   // Add users as ObjectIds
                messages: []  // Initially no messages
            });

            await chatRoom.save();
            console.log("✅ Chat room created:", chatRoom);
        }

        // Find the sender (user)
        const sender = await User.findById(userId);
        if (!sender) {
            console.log("❌ User not found:", userId);
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Create a new message
        const message = new Message({
            content,
            sender: sender._id,
            teamId,  // Link the message to the team (same as roomId)
            mentions,
        });

        console.log("📝 Saving Message:", message);
        await message.save();

        // Add the message to the chat room's messages array
        chatRoom.messages.push(message._id);
        await chatRoom.save();

        console.log("✅ Message Saved & Linked to ChatRoom:", message);
        res.status(200).json({ success: true, message });
    } catch (error) {
        console.error("🔥 Error sending message:", error);
        res.status(500).json({ success: false, message: "Error sending message", error: error.message });
    }
};


// Get all messages from a chat room
const getAllMessages = async (req, res) => {
  const { teamId } = req.params;

  try {
    const messages = await Message.find({ teamId })
      .populate('sender', 'name')  
      .populate('mentions', 'name')  
      .populate('replies.sender', 'name')  
      .sort({ createdAt: 1 });  

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error retrieving messages', error: error.message });
  }
};

const getMessagesByRoom = async (req, res) => {
  const { roomId } = req.params;

  try {
    const chatRoom = await ChatRoom.findOne({ roomId }).populate('messages');
    if (!chatRoom) return res.status(404).json({ success: false, message: 'Chat room not found' });

    res.status(200).json({ success: true, messages: chatRoom.messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error retrieving messages', error: error.message });
  }
};

module.exports = { sendMessage, getAllMessages, getMessagesByRoom };
