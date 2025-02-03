const teamRolesModel = require("../models/TeamRoleSchema");

const getAllTeamRoles = async (req, res) => {
    try {
        const roles = await teamRolesModel.find({isDeleted: false}).populate().exec();

        res.status(200).json({
            success: true,
            message: "All roles Data",
            data: roles
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: []
        })
    }
}



const createNewTeamRole = async (req, res) => {
    try {
        const { role, permissions } = req.body
        const newTeamRole = new teamRolesModel({
            role, permissions
        })
        const result = await newTeamRole.save()
        res.status(201).json({
            success: true,
            message: "role created successfully",
            data: result
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: 'Server internal error',
            data: []
        })
    }
}

const ModifyTeamRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, permissions } = req.body;

        const project = await ProjectModel.findOneAndUpdate(
            { _id: id },
            {
                role:role,
                permissions:permissions
            },
            { new: true }
        ).exec();
        res.status(200).json({
            success: true,
            message: 'Role Updated Successfully',
            data: project
        })



    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const DeleteTeamRole = async (req, res) => {
    try {
        const { id } = req.params;
        

        const project = await ProjectModel.findOneAndUpdate(
            { _id: id },
            {
                
                isDeleted:true
            },
            { new: true }
        ).exec();
        res.status(200).json({
            success: true,
            message: 'Role Updated Successfully',
            data: project
        })



    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { createNewTeamRole, getAllTeamRoles,ModifyTeamRole,DeleteTeamRole }