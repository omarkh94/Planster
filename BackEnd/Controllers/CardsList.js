const ListModel = require("../models/CardsListSchema")




const getAllLists = async function (req, res) {
    try {
        const List = await ListModel.find({isDeleted: false}).populate('list').exec()
        res.status(200).json({
            success: true,
            message: 'Lists data',
            data: List
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,

        })
    }

}

const addNewList = async (req, res) => {
    try {
        const { title, list, Project } = req.body
        const List = new ListModel({
            title,
            list,
            Project
        })
        const result = await List.save()

        res.status(201).json({
            success: true,
            message: 'List Added successfully',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


const getListsByProjectId = async (req, res) => {
    try {
        const { id } = req.params;
        const List = await ListModel.findOne({ project: id }).exec();
        res.status(200).json({
            success: true,
            message: 'List founded successfully',
            data: List
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
const modifyList = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, list, Project } = req.body;

        const List = await ListModel.findOneAndUpdate(
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
            data: List
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
const deleteList = async (req, res) => {
    try {
        const { id } = req.params;

        const List = await ListModel.findOneAndUpdate(
            { _id: id },
            {
                isDeleted: true,
            },
            { new: true }
        ).exec();
        res.status(200).json({
            success: true,
            message: 'List deleted successfully',
            data: List
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}




module.exports = { getAllLists, getListsByProjectId, addNewList, modifyList, deleteList };