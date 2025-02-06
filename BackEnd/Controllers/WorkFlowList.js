const WorkFlowListModel = require("../models/WorkFlowListSchema")




const getAllWorkFlowLists = async function (req, res) {
    try {
        const WorkFlowList = await WorkFlowListModel.find({ isDeleted: false }).populate('list').exec()
        res.status(200).json({
            success: true,
            message: 'WorkFlowList data',
            data: WorkFlowList
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,

        })
    }

}

const addNewWorkFlowList = async (req, res) => {
    try {
        const { title, list, Project } = req.body
        const WorkFlowList = new WorkFlowListModel({
            title,
            list,
            Project
        })
        const result = await WorkFlowList.save()

        res.status(201).json({
            success: true,
            message: 'WorkFlowList Added successfully',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


const getWorkFlowListsByProjectId = async (req, res) => {
    try {
        const { id } = req.params;
        const WorkFlowList = await WorkFlowListModel.findOne({ project: id }).exec();
        res.status(200).json({
            success: true,
            message: 'WorkFlowList founded successfully',
            data: WorkFlowList
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
const modifyWorkFlowList = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, list, Project } = req.body;

        const WorkFlowList = await WorkFlowListModel.findOneAndUpdate(
            { _id: id },
            {
                title: title,
                list: list,
                Project: Project
            },
            { new: true }
        ).exec();
        res.status(200).json({
            success: true,
            message: 'List deleted successfully',
            data: WorkFlowList
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
const deleteWorkFlowList = async (req, res) => {
    try {
        const { id } = req.params;

        const WorkFlowList = await WorkFlowListModel.findOneAndUpdate(
            { _id: id },
            {
                isDeleted: true,
            },
            { new: true }
        ).exec();
        res.status(200).json({
            success: true,
            message: 'WorkFlowList deleted successfully',
            data: WorkFlowList
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}




module.exports = { getAllWorkFlowLists, addNewWorkFlowList, getWorkFlowListsByProjectId, modifyWorkFlowList, deleteWorkFlowList };