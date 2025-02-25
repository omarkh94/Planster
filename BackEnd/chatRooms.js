const { Server } = require("socket.io");
const { createMessage, getMessagesByTeamId, deleteMessage } = require("./Controllers/Messages");

const initSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://192.168.1.24:5173'],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("JOIN_ROOM", async ({ teamId, userId }) => { // Changed param to teamId
      if (!teamId) {
        console.error("Missing teamId in JOIN_ROOM");
        return;
      }
      
      socket.join(teamId);
      console.log(`User ${userId} joined team: ${teamId}`);

      try {
        const messages = await getMessagesByTeamId(teamId);
        socket.emit("INITIAL_MESSAGES", messages);
      } catch (error) {
        console.error("Error fetching initial messages:", error);
      }
    });

    socket.on("SEND_MESSAGE", async (data) => {
      try {
        // Validate required fields
        if (!data?.teamId) throw new Error("Team ID is required");
        if (!data?.message?.trim()) throw new Error("Message content is required");
        if (!data?.userId) throw new Error("User ID is required");

        const savedMessage = await createMessage({
          body: {
            content: data.message,
            teamId: data.teamId,
            mentions: data.mentions || [],
            replyTo: data.replyTo || null
          },
          user: { _id: data.userId }
        });

        // Populate sender data before emitting
        const populatedMessage = await savedMessage
          .populate('sender', 'firstName lastName')
          .execPopulate();

        io.to(data.teamId).emit("RECEIVE_MESSAGE", {
          ...populatedMessage.toObject(),
          id: populatedMessage._id.toString(),
          teamId: data.teamId
        });
        
      } catch (error) {
        console.error("Error sending message:", error.message);
        socket.emit("MESSAGE_ERROR", {
          error: error.message,
          teamId: data?.teamId
        });
      }
    });

    socket.on("DELETE_MESSAGE", async ({ teamId, messageId, userId }) => { // Changed to teamId
      try {
        if (!teamId || !messageId || !userId) {
          throw new Error("Missing required parameters for deletion");
        }
        
        await deleteMessage({ 
          params: { messageId }, 
          user: { _id: userId } 
        });
        
        io.to(teamId).emit("MESSAGE_DELETED", messageId);
      } catch (error) {
        console.error("Error deleting message:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
};

module.exports = { initSocketServer };