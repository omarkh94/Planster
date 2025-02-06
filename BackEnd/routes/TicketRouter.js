const express = require('express');
const authorization = require('../middleWares/authorization');
const  { getAllTickets,getTicketsByListId,AddNewTicket,modifyExistingTicket,deleteTicketFromList } = require('../Controllers/Ticket');
const CommentsRouter = require('./CommentsRouter');
const authentication = require('../middleWares/authentication');
const TicketRouter = express.Router();

TicketRouter.use("/comment",CommentsRouter)
TicketRouter.get("/", authentication,getAllTickets)
TicketRouter.get("/:listId",authentication,getTicketsByListId)
TicketRouter.post("/",authentication,AddNewTicket)
TicketRouter.put("/:id",authentication,modifyExistingTicket)
TicketRouter.delete("/:id",authentication,deleteTicketFromList)


module.exports = TicketRouter