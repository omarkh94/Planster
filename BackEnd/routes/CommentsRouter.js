const express = require('express')
const authorization = require('../middleWares/authorization')
const { getCommentsByTicket, AddNewComment, getCommentByCommenter, modifyCommentByCommenter, deleteCommentByCommenter } = require('../Controllers/Comments')
const authentication = require('../middleWares/authentication')
const CommentsRouter = express.Router()


CommentsRouter.get("/:TicketID",authentication,getCommentsByTicket)
CommentsRouter.get("/:userId",authentication,getCommentByCommenter)
CommentsRouter.post("/",authentication,AddNewComment)
CommentsRouter.put("/:commentId",authentication,modifyCommentByCommenter)
CommentsRouter.delete("/:commentId",authentication,deleteCommentByCommenter)
module.exports = CommentsRouter



