const express = require("express");
const {
     getProjectsById,
     AddNewProject,
     ModifyProject,
     DeleteProject, projectMembers, getProjectsToUser,addNewListIntoProject,addCardToList,updateProjectOrder, 
     ModifyProjectName} = require("../Controllers/Project");


const RolesRouter = require('./RolesRouter')


const authentication = require("../middleWares/authentication");
const WorkFlowListRouter = require("./WorkFlowListRouter");
const ProjectRouter = express.Router()

ProjectRouter.use("/workFlowList", WorkFlowListRouter)
ProjectRouter.get("/:userId", authentication, getProjectsToUser)
ProjectRouter.get("/members/:projectId", authentication, projectMembers)
ProjectRouter.get("/project/:projectId", authentication, getProjectsById)
ProjectRouter.post("/new", authentication, AddNewProject)
ProjectRouter.post("/list/new/:projectId", authentication, addNewListIntoProject)
ProjectRouter.post("/card/new/:projectId", authentication, addCardToList)
ProjectRouter.put("/:projectId", authentication, ModifyProject)
ProjectRouter.put("/update/:projectId", authentication, updateProjectOrder)
ProjectRouter.put("/modify/:projectId", authentication, ModifyProjectName)
ProjectRouter.patch("/:projectId", authentication, DeleteProject)
ProjectRouter.use("/roles", RolesRouter)
ProjectRouter.use("/:projectId/lists", WorkFlowListRouter);
module.exports = { ProjectRouter }