const express = require('express')
const UserRouter = express.Router()
const {
    register, addUserToTeam, getAllUsers, login, getUsersByTeam, ModifyProfile, DeleteProfile, DeleteUser,
    getUsersByProject } = require("../Controllers/User");
const authentication = require('../middleWares/authentication');
const authorization = require('../middleWares/authorization');

UserRouter.post('/register', register);
UserRouter.post('/login', login);
UserRouter.post('/UserToTeam', authentication, authorization("UPDATE_TEAM"), addUserToTeam);
UserRouter.get('/', authentication, authorization("SHOW_USERS"), getAllUsers);
UserRouter.get('/:teamId', authentication, authorization("READ_TEAM"), getUsersByTeam);
UserRouter.get('/:projectId', authentication, authorization("READ_PROJECT"), getUsersByProject);
UserRouter.put("/:id", authentication, authorization("UPDATE_PROFILE"), ModifyProfile);
UserRouter.delete("/deactivate/:id", authentication, authorization("DELETE_PROFILE"), DeleteProfile);
UserRouter.delete("/delete/:id", authentication, authorization("DELETE_USER"), DeleteUser);

module.exports = UserRouter