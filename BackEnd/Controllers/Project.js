const ProjectModel = require("../models/ProjectSchema")
const TeamModel = require("../models/TeamSchema")
const ListModel = require("../models/CardsListSchema")
const CardModel = require("../models/CardSchema")
const TeamRoleModel = require("../models/TeamRoleSchema")


const getProjectsList = async function (req, res) {
    try {
        const Project = await ProjectModel.find({ isDeleted: false }).populate('User').exec()
        res.status(200).json({
            success: true,
            message: 'Projects data',
            data: Project
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,

        })
    }

}

const AddNewProject = async (req, res) => {
    try {
        const { userId } = req.token
        const { name, description, expectedDeadLine } = req.body
        const getTeamRole = await TeamRoleModel.find({ role: 'admin' })
        const { _id: teamRoleId } = getTeamRole[0];
        const createNewTeam = new TeamModel([{
            name,
            members: [{ user: userId, role: teamRoleId }]
        }])
        const createNewCard = new CardModel({
            title: 'Initial Card',
            description: 'Enjoy Planing Your project With Planster',
            author: userId
        })
        const createNewList = new ListModel({
            title: 'Initial List',
            author: userId,
            list: [createNewCard?._id]
        })
        createNewCard.save()
        createNewList.save()
        createNewTeam.save()
        const Project = new ProjectModel({
            name,
            description,
            expectedDeadLine,
            team: createNewTeam._id,
            projectOwner: userId,
            list: [createNewList]
        })
        console.log('Project :>> ', Project);
        const result = await Project.save()

        res.status(201).json({
            success: true,
            message: 'Project Added successfully',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


const getProjectsById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await ProjectModel.findOne({ _id: projectId }).exec();
        res.status(200).json({
            success: true,
            message: 'project founded successfully',
            data: project
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
const ModifyProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, expectedDeadLine, team, projectOwner, list } = req.body;

        const project = await ProjectModel.findOneAndUpdate(
            { _id: id },
            {
                name: name,
                description: description,
                expectedDeadLine: expectedDeadLine,
                team: team,
                projectOwner: projectOwner,
                list: list
            },
            { new: true }
        ).exec();
        res.status(200).json({
            success: true,
            message: 'Project Updated Successfully',
            data: project
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
const DeleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await ProjectModel.findOneAndUpdate(
            { _id: id },
            {
                isDeleted: true,
            },
            { new: true }
        ).exec();
        res.status(200).json({
            success: true,
            message: 'Project Deleted Successfully',
            data: project
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}




module.exports = { getProjectsList, getProjectsById, AddNewProject, ModifyProject, DeleteProject }