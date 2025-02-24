const express = require('express');
const { getAllWorkFlowLists, addNewWorkFlowList, getWorkFlowListsByProjectId, modifyWorkFlowList, deleteWorkFlowList , reorderTickets} = require('../Controllers/WorkFlowList');
const authorization = require('../middleWares/authorization');
const TicketRouter = require('./TicketRouter');
const authentication = require('../middleWares/authentication');
const WorkFlowListRouter = express.Router();

WorkFlowListRouter.use("/ticket", TicketRouter)
WorkFlowListRouter.get("/", authentication, authorization("READ_LIST"), getAllWorkFlowLists)
// WorkFlowListRouter.get("/:projectId", authentication, authorization("READ_PROJECT"), getWorkFlowListsByProjectId)
WorkFlowListRouter.put("/", authentication, addNewWorkFlowList)
WorkFlowListRouter.put("/:listId", authentication, authorization("UPDATE_LIST"), modifyWorkFlowList)
WorkFlowListRouter.delete("/:listId", authentication, authorization("DELETE_LIST"), deleteWorkFlowList)
WorkFlowListRouter.put("/:listId/reorder-tickets", authentication ,reorderTickets )

module.exports = WorkFlowListRouter


