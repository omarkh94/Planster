const mongoose = require("mongoose");
const {saveMessage,getMessagesByRoomId} = require("./Controllers/")
const { Message } = require("./models/MessageSchema.js") 
let users = [];

const pushNotifications = (notifiedUsers, message, io) => {
  notifiedUsers.forEach(userId => {
      const user = getUser(userId); 
      
      if (user) {
          io.to(user.socketId).emit("PUSH_NOTIFICATION", {
              title: "📩 New Messages",
              body: message.content,
              chatRoomId: message.chatRoomId,
              sender: message.sender,
              timestamp: message.timestamp,
          });
          console.log(`🔔 ${userId}`);
      } else {
          console.log(`⚠️  ${userId}`);
      }
  });
};






const addUser = (userId, socketId) => {
  !users.some((user) => user.userId == userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId != socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId == userId);
};
 const initChatRoom = (socket, io, rooms) => {
  socket.removeAllListeners("joinRoom");
  socket.removeAllListeners("disconnect");


  socket.on("JOIN_ROOM", async ({ roomId, userId }) => {
    console.log(`User ${userId} joined room: ${roomId}`);
    socket.join(roomId);

    try {
      const roomMessages = await getMessagesByRoomId(roomId);
      if (roomMessages.length > 0) {
        io.to(roomId).emit("INITIAL_MESSAGES", roomMessages);
      } else {
        const defaultMessage = {
          id: `${Date.now()}`,
          content: "No messages yet. Be the first to send a message!",
          sender: { id: "system", name: "System" },
          chatRoomId: roomId,
          mentions: [],
          replies: [],
          seenBy: [],
          deliveredTo: [],
          notifiedUsers: [],
          timestamp: new Date().toISOString(),
        };
        io.to(roomId).emit("INITIAL_MESSAGES", [defaultMessage]);
      }
    } catch (error) {
      console.error("❌: Something went wrong fetching messages", error);
    }
  });




  socket.on('CREATE_ROOM', ({ roomId, userId }) => {
    if (rooms[roomId] != null && !rooms[roomId]?.users?.includes(userId)) {
      rooms[roomId]?.users?.push(userId)

    } else {
      rooms[roomId] = { users: [userId] }
    }
    socket.join(roomId)
    console.log('rooms :>> ', rooms);

  })
  socket.on("ADD_USER", (userId) => {
    const userRoomId = getUser(userId)?.roomId || 'defaultRoom';
    const messages = rooms[userRoomId]?.messages || [];

    console.log(`Emitting initial messages for room ${userRoomId}:`, messages);
    socket.emit("GET_DATA", { messages });
  });




  socket.on("SEND_MESSAGE", async ({ roomId, message, userId, from, mentions = [], replyTo = null }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = { messages: [], users: [], projectMembers: [] };
    }

    const usersInRoom = rooms[roomId].users || [];
    const projectMembers = rooms[roomId].projectMembers || [];
    const notifiedUsers = projectMembers.filter(memberId => !usersInRoom.includes(memberId));

    try {
      const savedMessage = await saveMessage({
        content: message,
        senderId: userId,
        roomId,
        mentions,
        replyTo
      });

      const newMessage = {
        id: savedMessage._id.toString(),
        content: savedMessage.content,
        sender: { id: savedMessage.sender, name: from },
        chatRoomId: savedMessage.chatRoomId,
        mentions: savedMessage.mentions,
        replies: savedMessage.replies,
        seenBy: [],
        deliveredTo: usersInRoom,
        notifiedUsers,
        timestamp: savedMessage.timestamp,
      };

      rooms[roomId].messages.push(newMessage);
      pushNotifications(notifiedUsers, newMessage, io);
      io.to(roomId).emit("RECEIVE_MESSAGE", newMessage);
    } catch (error) {
      console.error("❌: Error While Saving Messages", error);
    }
  });



  socket.on("DELETE_MESSAGE", ({ roomId, messageId }) => {
    if (rooms[roomId]) {
      const message = rooms[roomId].messages.find(msg => msg.id === messageId);

      if (message) {
        message.isDeleted = true;
        io.to(roomId).emit("RECEIVE_MESSAGE", rooms[roomId].messages);
      }
    }
  });







  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("GET_USERS", users);
  });

}

module.exports = {initChatRoom} 