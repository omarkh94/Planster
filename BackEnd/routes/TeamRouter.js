const express = require('express')
const { getTeamById, modifyExistingTeam, deleteTeamMember } = require('../Controllers/Team')
const authentication = require('../middleWares/authentication')
const TeamRouter = express.Router()

TeamRouter.get("/:id", authentication, getTeamById)
TeamRouter.put("/:id", authentication, modifyExistingTeam)
TeamRouter.delete("/members/:teamId", authentication, deleteTeamMember)


module.exports = TeamRouter


