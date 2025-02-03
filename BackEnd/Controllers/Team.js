const TeamModel = require("../models/TeamSchema")


const getAllTeams = async function (req, res) {
    try {
        const Card = await TeamModel.find({isDeleted: false}).populate('Card').exec()
        res.status(200).json({
            success: true,
            message: 'Cards data',
            data: Card
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,

        })
    }

}

const AddNewTeam = async (req, res) => {
    try {
        const { member } = req.body
        const Card = new TeamModel({ 
            
            member,
            
         })
        const result = await Card.save()

        res.status(201).json({
            success: true,
            message: 'Card Added successfully',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


const getTeamById = async (req, res) => {
    try {
        const { id } = req.params;
            const Card = await TeamModel.findOne({project: id}).exec();
        res.status(200).json({
            success: true,
            message: 'Card founded successfully',
            data: Card
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//todo updatedby
const modifyExistingTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { title,card,Project } = req.body;

        const Card = await TeamModel.findOneAndUpdate(
            { _id: id },
            {
                title:title,
                card:card,
                Project:Project
            },
            { new: true }
        ).exec();
        res.status(200).json({
            success: true,
            message: 'Card deleted successfully',
            data: Card
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;

        const Card = await TeamModel.findOneAndUpdate(
            { _id: id },
            {
                isDeleted: true,
            },
            { new: true }
        ).exec();
        res.status(200).json({
            success: true,
            message: 'Card deleted successfully',
            data: Card
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}





module.exports = {getAllTeams,AddNewTeam,getTeamById,modifyExistingTeam,deleteTeam}