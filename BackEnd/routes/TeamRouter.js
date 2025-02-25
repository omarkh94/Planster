const express = require('express')
const { getTeamById, modifyExistingTeam, deleteTeamMember } = require('../Controllers/Team')
const authentication = require('../middleWares/authentication')
const { getUsersAreNotInThisProject, addUserToTeam } = require('../Controllers/User')
const TeamRouter = express.Router()

TeamRouter.get("/:teamId", authentication, getTeamById)
TeamRouter.put("/:id", authentication, modifyExistingTeam)
TeamRouter.delete("/members/:teamId", authentication, deleteTeamMember)

// user controller Routes
TeamRouter.get('/member/:teamId', authentication , getUsersAreNotInThisProject);
TeamRouter.put('/addMember/:teamId', authentication , addUserToTeam);
module.exports = TeamRouter


