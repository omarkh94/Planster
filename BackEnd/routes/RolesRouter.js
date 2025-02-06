const express = require("express");
const { createNewRole, getAllRoles,ModifyRole,DeleteRole } = require("../Controllers/Roles");
const authorization = require("../middleWares/authorization");
const authentication = require("../middleWares/authentication");
const RolesRouter = express.Router()

RolesRouter.get("/", getAllRoles)
RolesRouter.post("/",  createNewRole)
RolesRouter.post("/:id", ModifyRole)
RolesRouter.post("/:id",  DeleteRole)


module.exports = RolesRouter