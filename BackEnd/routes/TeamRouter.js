const express = require('express')
const { getAllTeams, AddNewTeam, getTeamById, modifyExistingTeam, deleteTeam } = require('../Controllers/Team')
const authorization = require('../middleWares/authorization')
const TeamRolesRouter = require('./TeamRolesRouters')
const authentication = require('../middleWares/authentication')
const TeamRouter = express.Router()

TeamRouter.get("/",authentication,authorization("READ_TEAM"),getAllTeams)
TeamRouter.post("/",authentication,authorization("CREATE_TEAM"),AddNewTeam)
TeamRouter.get("/:id",authentication,authorization("READ_TEAM"),getTeamById)
TeamRouter.put("/:id",authentication,authorization("UPDATE_TEAM"),modifyExistingTeam)
TeamRouter.delete("/:id",authentication,authorization("DELETE_TEAM"),deleteTeam)
TeamRouter.use("/roles",TeamRolesRouter)

module.exports = TeamRouter


