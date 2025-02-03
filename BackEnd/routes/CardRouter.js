const express = require('express');
const authorization = require('../middleWares/authorization');
const { getAllCards, getCardsByListId, AddNewCard, modifyExistingCard, deleteCardFromList } = require('../Controllers/Card');
const CommentsRouter = require('./CommentsRouter');
const authentication = require('../middleWares/authentication');
const CardRouter = express.Router();

CardRouter.use("/comment",CommentsRouter)
CardRouter.get("/", authentication,getAllCards)
CardRouter.get("/:listId",authentication,getCardsByListId)
CardRouter.post("/",authentication,AddNewCard)
CardRouter.put("/:id",authentication,modifyExistingCard)
CardRouter.delete("/:id",authentication,deleteCardFromList)


module.exports = CardRouter