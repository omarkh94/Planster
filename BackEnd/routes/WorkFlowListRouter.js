const express = require('express');
const { getAllWorkFlowLists, addNewWorkFlowList, getWorkFlowListsByProjectId, modifyWorkFlowList, deleteWorkFlowList } = require('../Controllers/WorkFlowList');
const authorization = require('../middleWares/authorization');
const TicketRouter = require('./TicketRouter');
const authentication = require('../middleWares/authentication');
const WorkFlowListRouter = express.Router();

WorkFlowListRouter.use("/ticket", TicketRouter)
WorkFlowListRouter.get("/", authentication, authorization("READ_LIST"), getAllWorkFlowLists)
WorkFlowListRouter.get("/:projectId", authentication, authorization("READ_PROJECT"), getWorkFlowListsByProjectId)
WorkFlowListRouter.post("/", authentication, authorization("CREATE_LIST"), addNewWorkFlowList)
WorkFlowListRouter.put("/:id", authentication, authorization("UPDATE_LIST"), modifyWorkFlowList)
WorkFlowListRouter.delete("/:id", authentication, authorization("DELETE_LIST"), deleteWorkFlowList)


module.exports = WorkFlowListRouter


