const express = require('express');
const UserRouter = express.Router();

const {getAllUsers,register,login,getMemberById,getUsersByTeam,modifyProfile,deleteProfile,removeMemberFromProject,moveOrRemoveMemberFromTeam,addUserToTeam,addUserToProject,addProjectToUser } = require("../Controllers/User");

const authentication = require('../middleWares/authentication');
const authorization = require('../middleWares/authorization');

// Authentication Routes
UserRouter.post('/register', register);
UserRouter.post('/login', login);

// Profile Routes
UserRouter.get('/', authentication, authorization("SHOW_USERS"), getAllUsers);
UserRouter.get('/:userId', getMemberById);
UserRouter.put('/profile/:userId', authentication,  modifyProfile);
UserRouter.delete('/profile/:id', authentication, authorization("DELETE_PROFILE"), deleteProfile);

// Team Routes
UserRouter.put('/team/addUser', authentication, authorization("UPDATE_TEAM"), addUserToTeam);
UserRouter.put('/project/addUser', authentication, authorization("UPDATE_TEAM"), addUserToProject);
UserRouter.put('/project/addUser', authentication, authorization("UPDATE_TEAM"), addProjectToUser);
UserRouter.get('/team/:teamId', authentication, authorization("READ_TEAM"), getUsersByTeam);
UserRouter.put('/team/:teamId/member/:memberId', authentication, authorization("MOVE_OR_REMOVE_MEMBER_FROM_TEAM"), moveOrRemoveMemberFromTeam);

// Project Routes
UserRouter.delete('/project/:projectId/member/:memberId', authentication, authorization("REMOVE_MEMBER_FROM_PROJECT"), removeMemberFromProject);

module.exports = UserRouter;
