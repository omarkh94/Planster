const RolesModel = require("../models/RoleSchema");

const getAllRoles = async (req, res) => {
    try {
        const roles = await RolesModel.find({isDeleted: false}).populate().exec();

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
const getRolesRole = async (req, res) => {
    try {
        const{role}=req.body
        const roles = await RolesModel.find({role:role}).populate("role").exec();
        res.status(200).json({
            success: true,
            message: "your Role",
            data: roles
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            
        })
    }
}



const createNewRole = async (req, res) => {
    try {
        const { role, permissions } = req.body
        const newRole = new RolesModel({
            role, permissions
        })
        const result = await newRole.save()
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

const ModifyRole = async (req, res) => {
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
const DeleteRole = async (req, res) => {
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

module.exports = { createNewRole,getRolesRole, getAllRoles,ModifyRole,DeleteRole }