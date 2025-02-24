const express = require('express');
const UserRouter = express.Router();

const { register, login, modifyProfile, deleteProfile, addUserToTeam, getUsersAreNotInThisProject } = require("../Controllers/User");

const authentication = require('../middleWares/authentication');
const authorization = require('../middleWares/authorization');

// Authentication Routes
UserRouter.post('/register', register);
UserRouter.post('/login', login);

// Profile Routes
UserRouter.put('/profile/:userId', authentication, modifyProfile);
UserRouter.delete('/profile/:id', authentication, authorization("DELETE_PROFILE"), deleteProfile);

UserRouter.put('/team/addUser', authentication, addUserToTeam);
UserRouter.post('team/getUsers/:teamId', authentication, getUsersAreNotInThisProject)

// Project Routes

module.exports = UserRouter;
