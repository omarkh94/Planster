const express = require("express");
const { createNewTeamRole, getAllTeamRoles, ModifyTeamRole, DeleteTeamRole } = require("../Controllers/TeamRoles");
const authorization = require("../middleWares/authorization");
const authentication = require("../middleWares/authentication");
const TeamRolesRouter = express.Router()

TeamRolesRouter.get("/", authentication, authorization("READ_ROLE"), getAllTeamRoles)
TeamRolesRouter.post("/", authentication, authorization("CREATE_ROLE"), createNewTeamRole)
TeamRolesRouter.post("/:id", authentication, authorization("MODIFY_ROLE"), ModifyTeamRole)
TeamRolesRouter.post("/:id", authentication, authorization("DELETE_ROLE"), DeleteTeamRole)


module.exports = TeamRolesRouter