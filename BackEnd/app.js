
const express = require('express')
require('dotenv/config');
require("./models/db");
const cors = require('cors')
const { Server } = require("socket.io");
const PORT = process.env.PORT
const UserRouter = require('./routes/UserRouter');
const { ProjectRouter } = require('./routes/ProjectRouters');
const TeamRouter = require('./routes/TeamRouter');
const { initChatRoom } = require('./chatRooms');
const MessageRouter = require('./routes/MessagesRouter');
const app = express()
app.use(cors())
app.use(express.json())

require('./models/db')
app.use('/users', UserRouter)
app.use('/team', TeamRouter)
app.use('/project', ProjectRouter)
app.use("/teamRoom", MessageRouter)

const server = app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`))



const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://192.168.1.24:5173'],
        methods: ["GET", "POST"],
    }
})
const rooms = {
}

io.on("connection", (socket) => {
    try {
        initChatRoom(socket, io, rooms);
        console.log("A user connected.");
    } catch (error) {
        console.error("Error in chat room initialization:", error);
    }
});
