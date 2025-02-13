
const usersModel = require('../models/UserSchema');
const TeamModel = require('../models/TeamSchema');
const projectModel = require('../models/ProjectSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv")



const getAllUsers = async (req, res) => {
    try {
        const users = await usersModel.find({ isDeleted: false }).populate('projects.project')
            .populate('projects.role').exec()
        res.status(200).json({
            success: true,
            message: 'Users data',
            data: users
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,

        })
    }
}




const register = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, jobTitle, projects, gender, email, password, team } = req.body
        const user = new usersModel({ firstName, lastName, jobTitle, phoneNumber, projects, gender, email, password, team })


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

const getMemberById = async (req, res) => {
    try {
        const { userId } = req.params;

        const member = await usersModel.findOne({ _id: userId, isDeleted: false });

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Member retrieved successfully",
            data: member,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



const getUsersByTeam = async (req, res) => {
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



const removeMemberFromProject = async (req, res) => {
    try {
        const { projectId, memberId } = req.body;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        await projectModel.findByIdAndUpdate(projectId, { $pull: { members: { user: memberId } } });
        res.status(200).json({ success: true, message: 'Member removed from project successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const moveOrRemoveMemberFromTeam = async (req, res) => {
    try {
        const { teamId, memberId, newTeamId } = req.body;
        if (!['admin', 'supervisor'].includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        await TeamModel.findByIdAndUpdate(teamId, { $pull: { members: memberId } });

        if (newTeamId) {
            await TeamModel.findByIdAndUpdate(newTeamId, { $push: { members: memberId } });
            res.status(200).json({ success: true, message: 'Member moved to new team successfully' });
        } else {
            res.status(200).json({ success: true, message: 'Member removed from team successfully' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addUserToTeam = async (req, res) => {
    try {
        const { email, teamId } = req.body;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        const userToAdd = await usersModel.findOne({ email });
        if (!userToAdd) return res.status(404).json({ success: false, message: 'User not found' });

        const updatedTeam = await TeamModel.findByIdAndUpdate(teamId, { $push: { members: userToAdd._id } }, { new: true });
        res.status(201).json({ success: true, message: 'Member added successfully', data: updatedTeam });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const isProjectAdmin = async (userId, projectId) => {
    const project = await projectModel.findById(projectId);
    return project && project.admin.toString() === userId.toString();
};

const addUserToProject = async (req, res) => {
    try {
        const { projectId, userId, mode } = req.body;
        if (!projectId || !userId || !mode) {
            return res.status(400).json({
                success: false,
                message: "projectId, userId, and mode (invite/join) are required."
            });
        }
        if (mode === "invite") {
            const isAdmin = await isProjectAdmin(req.user.id, projectId);
            if (!isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to invite users to this project."
                });
            }
            await projectModel.findByIdAndUpdate(
                projectId,
                { $addToSet: { invitedUsers: userId } },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                message: "User invited to the project successfully."
            });
        } else if (mode === "join") {
            if (req.user.id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "You cannot request to join on behalf of another user."
                });
            }

            await projectModel.findByIdAndUpdate(
                projectId,
                { $addToSet: { joinRequests: userId } },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: "Join request submitted successfully."
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid mode. Use 'invite' for project admin invitation or 'join' for user join request."
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}









module.exports = { register, getMemberById, login, getAllUsers, getUsersByTeam, modifyProfile, deleteProfile, removeMemberFromProject, moveOrRemoveMemberFromTeam, addUserToTeam };















