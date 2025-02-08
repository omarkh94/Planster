const express = require("express");
const { getProjectsList,
     getProjectsById,
     AddNewProject,
     ModifyProject,
     DeleteProject, projectMembers} = require("../Controllers/Project");


const RolesRouter = require('./RolesRouter')


const authentication = require("../middleWares/authentication");
const authorization = require("../middleWares/authorization");
const WorkFlowListRouter = require("./WorkFlowListRouter");
const ProjectRouter = express.Router()

ProjectRouter.use("/workFlowList", WorkFlowListRouter)
ProjectRouter.get("/", authentication, authorization("READ_PROJECT"), getProjectsList)
ProjectRouter.get("/members/:projectId", authentication, authorization("READ_PROJECT"), projectMembers)
ProjectRouter.get("/:projectId", authentication, authorization("READ_PROJECT"), getProjectsById)
ProjectRouter.post("/", authentication, AddNewProject)
ProjectRouter.put("/:id", authentication, authorization("UPDATE_PROJECT"), ModifyProject)
ProjectRouter.delete("/:id", authentication, authorization("DELETE_PROJECT"), DeleteProject)
ProjectRouter.use("/roles", RolesRouter)

module.exports = { ProjectRouter }