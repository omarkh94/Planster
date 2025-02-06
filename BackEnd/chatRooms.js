let users = [];

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
export const initChatRoom = (socket, io, rooms) => {
  socket.removeAllListeners("joinRoom");
  socket.removeAllListeners("disconnect");



    socket.on("JOIN_ROOM", ({ roomId, userId }) => {
        console.log(`User ${userId} joined room: ${roomId}`);
        socket.join(roomId);
      
        const roomMessages = rooms[roomId]?.messages || [];
        io.to(roomId).emit("INITIAL_MESSAGES", roomMessages);
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
    


    

    socket.on('SEND_MESSAGE', ({ roomId, message, userId,from, mentions = [], replyTo = null }) => {
        if (!rooms[roomId]) {
            rooms[roomId] = { messages: [] };
        }
  
        const newMessage = {
            id: `${Date.now()}`,  
            content: message,
            sender: { id: userId, name: from },  
            teamId: roomId,
            mentions,  
            replies: replyTo ? [{ reply: message, sender: userId, createdAt: new Date().toISOString() }] : [],
            timestamp: new Date().toISOString(),
        };
  
      rooms[roomId].messages.push(newMessage);
  
      io.to(roomId).emit('RECEIVE_MESSAGE', rooms[roomId].messages);
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

