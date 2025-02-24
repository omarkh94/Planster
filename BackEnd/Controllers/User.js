
const usersModel = require('../models/UserSchema');
const TeamModel = require('../models/TeamSchema');
const projectModel = require('../models/ProjectSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
        const { userId, teamId } = req.body;

        // Add user to the team
        const updatedTeam = await TeamModel.findByIdAndUpdate(
            teamId,
            { $addToSet: { members: userId } }, // Avoid duplicate members
            { new: true }
        );

        if (!updatedTeam) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }

        // Get the project associated with this team
        const project = await projectModel.findOne({ team: teamId });

        if (project) {
            // Add the project to the user's projects array
            await usersModel.findByIdAndUpdate(
                userId,
                { $addToSet: { projects: project._id } }, // Add single project ID, avoiding duplicates
                { new: true }
            );
        }

        res.status(201).json({
            success: true,
            message: "Member added successfully",
            data: updatedTeam,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getUsersAreNotInThisProject = async (req, res) => {
    try {
        const { teamId } = req.params
        const { userId } = req.token;

        const users = await TeamModel.find({
            _id: teamId,
            members: { $ne: userId }
        });

        res.status(200).json({ success: true, data: users });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    register, login,
    getUsersAreNotInThisProject, modifyProfile,
    deleteProfile, addUserToTeam,
    getUsersAreNotInThisProject
};



