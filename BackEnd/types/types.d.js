// Mock data for testing
const mockChatRooms = [
    { roomId: 'room1', users: ['user1', 'user2'], messages: [] },
    { roomId: 'room2', users: ['user2', 'user3'], messages: [] },
  ];
  
  const mockMessages = [
    { content: 'Hello world!', sender: 'user1', roomId: 'room1' },
    { content: 'How are you?', sender: 'user2', roomId: 'room2' },
  ];
  
  // Initialize chat room
  const initChatRoom = (socket, io, rooms) => {
    socket.on('joinRoom', (roomId) => {
      // Mock joining a room
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });
  
    socket.on('sendMessage', async (messageData) => {
      try {
        const { roomId, content, senderId } = messageData;
  
        // Mock saving the message
        const message = { content, sender: senderId, roomId };
        mockMessages.push(message);
  
        // Mock finding the chat room
        const chatRoom = mockChatRooms.find((room) => room.roomId === roomId);
        if (chatRoom) {
          // Mock emitting the message to all users in the room
          io.to(roomId).emit('receiveMessage', message);
          console.log(`Message sent to room ${roomId}:`, message);
        } else {
          console.log(`Chat room not found: ${roomId}`);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });
  };
  