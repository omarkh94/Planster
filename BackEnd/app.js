
const express = require('express')
require('dotenv/config');
require("./models/db");
const cors = require('cors')
const cookieParser = require('cookie-parser');
const { Server } = require("socket.io");
const PORT = process.env.PORT
const UserRouter = require('./routes/UserRouter');
const { ProjectRouter } = require('./routes/ProjectRouters');
const TeamRouter = require('./routes/TeamRouter');
const MessageRouter = require('./routes/MessagesRouter');
const InviteRouter = require('./routes/InviteRouter');
const  {initChatRoom}  = require("./ChatRooms");
const app = express()


const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true, 
  };
  
  app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser());
require('./models/db')
app.use('/users', UserRouter)
app.use('/team', TeamRouter)
app.use('/project', ProjectRouter)
app.use("/messages", MessageRouter)
app.use("/api/invite", InviteRouter);
app.get('/test', (req,res)=>{return res.json("server is running")})
const server = app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`))



const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://192.168.1.24:5173'],
        methods: ["GET",'PUT', "POST"],
        credentials: true,
    }
})
const rooms = {
}

io.on("connection", (socket) => {
    try {
        initChatRoom (socket, io, rooms);
        console.log("A user connected.");
    } catch (error) {
        console.error("Error in chat room initialization:", error);
    }
});



