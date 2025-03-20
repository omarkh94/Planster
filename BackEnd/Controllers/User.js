
const usersModel = require('../models/UserSchema');
const TeamModel = require('../models/TeamSchema');
const projectModel = require('../models/ProjectSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
require("dotenv")

const register = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, jobTitle, projects, email, password, team } = req.body
        const user = new usersModel({ firstName, lastName, jobTitle, phoneNumber, projects, email, password, team })


        const existingUser = await usersModel.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(400).json({
                success: true,
                message: 'Email already exists',
                data: result
            });
        }
        const result = await user.save()

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const result = await usersModel.find({
            email: email.toLowerCase()
        });
        if (result?.length > 0) {
            const [user] = result
            bcrypt.compare(password, user?.password, (err, result) => {
                if (err) {
                    res.status(400).json({
                        success: false,
                        message: 'Email or password incorrect',
                    });
                }
                if (result) {
                    const payload = {
                        userId: user._id,
                        email: user.email,
                    }

                    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' });
                    res.status(200).json({
                        success: true,
                        message: 'Logged In successful',
                        token: token
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        message: 'Email or password incorrect',
                    });
                }

                ``
            });


        } else {
            res.status(400).json({
                success: false,
                message: 'Email or password incorrect',
            });
        }
    } catch (error) {
        console.log('error :>> ', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('userId :>> ', userId);
        const users = await usersModel.find({ _id: userId, isDeleted: false });
        res.status(200).json({
            success: true,
            message: ' users retrieved successfully',
            data: users
        });
        console.log('users :>> ', users);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getTeammates = async (req, res) => {
    try {
        const { teamId } = req.params;
        const users = await usersModel.find({ team: teamId, isDeleted: false });
        res.status(200).json({
            success: true,
            message: ' users retrieved successfully',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const modifyProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedData = req.body;

        if (updatedData.password) {
            const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
            updatedData.password = await bcrypt.hash(updatedData.password, salt);
        }

        const updatedUser = await usersModel.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        await usersModel.findByIdAndUpdate(userId, { isDeleted: true });
        res.status(200).json({ success: true, message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addUserToTeam = async (req, res) => {
    try {
        console.log('Received body:', req.body);
        const { userId, roleId } = req.body; // Make sure roleId is passed in the request
        const { teamId } = req.params;
        // Validate the teamId and userId as ObjectIds
        if (!mongoose.Types.ObjectId.isValid(teamId)) {
            return res.status(400).json({ success: false, message: "Invalid team ID" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        if (!mongoose.Types.ObjectId.isValid(roleId)) { // Validate the roleId if needed
            return res.status(400).json({ success: false, message: "Invalid role ID" });
        }

        // Check if team exists
        const team = await TeamModel.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }

        // Add the user to the team with the role
        const updatedTeam = await TeamModel.findByIdAndUpdate(
            teamId,
            { $push: { members: { user: userId, role: roleId } } }, // Push an object with user and role
            { new: true }
        );

        if (!updatedTeam) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }

        console.log('Updated Team:', updatedTeam);

        // Check for associated projects and add user to projects if needed
        const project = await projectModel.findOne({ team: teamId });
        if (project) {
            await usersModel.findByIdAndUpdate(
                userId,
                { $addToSet: { projects: project._id } },
                { new: true }
            );
        }

        res.status(201).json({
            success: true,
            message: "Member added successfully",
            data: updatedTeam,
        });

    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};







const getUsersAreNotInThisProject = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { userId } = req.token;

        if (!mongoose.Types.ObjectId.isValid(teamId)) {
            return res.status(400).json({ success: false, message: "Invalid team ID" });
        }

        const team = await TeamModel.findById(teamId);
        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }

        const teamMemberIds = team.members.map(member => member.user.toString());

        const usersNotInTeam = await usersModel.find({
            _id: { $nin: teamMemberIds }
        });

        res.status(200).json({ success: true, data: usersNotInTeam });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    register, login,
    getUsersAreNotInThisProject, modifyProfile,
    deleteProfile, addUserToTeam,
    getUsersAreNotInThisProject, getUserById
};



