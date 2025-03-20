const express = require('express');
require('dotenv/config');
require("./models/db");
const cors = require('cors');
const PORT = process.env.PORT;
const UserRouter = require('./routes/UserRouter');
const { ProjectRouter } = require('./routes/ProjectRouters');
const TeamRouter = require('./routes/TeamRouter');
const MessageRouter = require('./routes/MessagesRouter');
const InviteRouter = require('./routes/InviteRouter');
const { initSocketServer } = require("./ChatRooms"); 

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'http://192.168.1.24:5173'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/users', UserRouter);
app.use('/team', TeamRouter);
app.use('/projects', ProjectRouter);
app.use("/messages", MessageRouter);
app.use("/api/invite", InviteRouter);

app.get('/test', (req, res) => res.json("server is running"));

const server = app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`));

const io = initSocketServer(server); 
