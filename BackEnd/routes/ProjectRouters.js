const express = require("express");
const { 
     getProjectsById,
     AddNewProject,
     ModifyProject,
     DeleteProject, projectMembers , getProjectsBelongsToId} = require("../Controllers/Project");


const RolesRouter = require('./RolesRouter')


const authentication = require("../middleWares/authentication");
const authorization = require("../middleWares/authorization");
const WorkFlowListRouter = require("./WorkFlowListRouter");
const ProjectRouter = express.Router()

ProjectRouter.use("/workFlowList", WorkFlowListRouter)
ProjectRouter.get("/:userId", authentication, getProjectsBelongsToId)
ProjectRouter.get("/members/:projectId", authentication, authorization("READ_PROJECT"), projectMembers)
ProjectRouter.get("/project/:projectId", authentication, getProjectsById)
ProjectRouter.post("/new", authentication, AddNewProject)
ProjectRouter.put("/:projectId", authentication, ModifyProject)
ProjectRouter.delete("/:id", authentication, authorization("DELETE_PROJECT"), DeleteProject)
ProjectRouter.use("/roles", RolesRouter)
ProjectRouter.use("/:projectId/lists", WorkFlowListRouter);
module.exports = { ProjectRouter }