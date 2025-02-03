const express = require('express');
const { getAllLists, getListsByProjectId, addNewList, modifyList, deleteList } = require('../Controllers/CardsList');
const authorization = require('../middleWares/authorization');
const CardRouter = require('./CardRouter');
const authentication = require('../middleWares/authentication');
const CardsListRouter = express.Router();

CardsListRouter.use("/card", CardRouter)
CardsListRouter.get("/", authentication, authorization("READ_LIST"), getAllLists)
CardsListRouter.get("/:projectId", authentication, authorization("READ_PROJECT"), getListsByProjectId)
CardsListRouter.post("/", authentication, authorization("CREATE_LIST"), addNewList)
CardsListRouter.put("/:id", authentication, authorization("UPDATE_LIST"), modifyList)
CardsListRouter.delete("/:id", authentication, authorization("DELETE_LIST"), deleteList)


module.exports = CardsListRouter