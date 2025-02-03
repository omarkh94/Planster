
const usersModel = require('../models/UserSchema');
const TeamModel = require('../models/TeamSchema');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv")
const getAllUsers = async (req, res) => {
    try {
        const users = await usersModel.find({ isDeleted: false }).populate('TeamRole').exec()
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
        const { name, lastName, email, password } = req.body
        const user = new usersModel({
            name,
            lastName,
            email,
            password
        })
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
            email: email
        })
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
                        userName: user.username,
                    }

                    const token = jwt.sign(payload, process.env.SECRET, {});
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

const getUsersByTeam = async (req, res) => {
    try {
        const admins = await usersModel.find();

        res.status(200).json({
            success: true,
            message: 'Admin users retrieved successfully',
            data: admins
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const ModifyProfile = async (req, res) => {
    try {
        const admins = await usersModel.find();

        res.status(200).json({
            success: true,
            message: 'Admin users retrieved successfully',
            data: admins
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const DeleteProfile = async (req, res) => {
    try {
        const admins = await usersModel.find();

        res.status(200).json({
            success: true,
            message: 'Admin users retrieved successfully',
            data: admins
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const DeleteUser = async (req, res) => {
    try {
        const admins = await usersModel.find();

        res.status(200).json({
            success: true,
            message: 'Admin users retrieved successfully',
            data: admins
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getUsersByProject = async (req, res) => {
    try {
        const admins = await usersModel.find();

        res.status(200).json({
            success: true,
            message: 'Admin users retrieved successfully',
            data: admins
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const addUserToTeam = async (req, res) => {

    try {
        const addedBy = req.token.userId;
        const { email
            , TeamId, role } = req.body;
        const userToAdd = await usersModel.findOne({ email: email })



        const result = await TeamModel.findByIdAndUpdate(TeamId, {
            $push: {
                members: { user: userToAdd._id, role: role }
            }
        }, { new: true })

        res.status(201).json({
            success: true,
            message: 'member added successfully',
            data: result,
            addedBy: addedBy,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports = { register, login, getAllUsers, getUsersByTeam, ModifyProfile, DeleteProfile, DeleteUser, getUsersByProject, addUserToTeam }



