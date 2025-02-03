const express = require("express");
const { getProjectsList, getProjectsById, AddNewProject, ModifyProject, DeleteProject } = require("../Controllers/Project");
const authentication = require("../middleWares/authentication");
const authorization = require("../middleWares/authorization");
const CardsListRouter = require("./CardsListRouter");
const ProjectRouter = express.Router()

ProjectRouter.use("/cardList", CardsListRouter)
ProjectRouter.get("/", authentication, authorization("READ_PROJECT"), getProjectsList)
ProjectRouter.get("/:projectId", authentication, authorization("READ_PROJECT"), getProjectsById)
ProjectRouter.post("/", authentication, AddNewProject)
ProjectRouter.put("/:id", authentication, authorization("UPDATE_PROJECT"), ModifyProject)
ProjectRouter.delete("/:id", authentication, authorization("DELETE_PROJECT"), DeleteProject)
// todo middleware


module.exports = { ProjectRouter }