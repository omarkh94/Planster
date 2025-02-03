const CardModel = require("../models/CardSchema")





const getAllCards = async function (req, res) {
    try {
        res.status(200).json({ success: true });
        // const cards = await CardModel.find({ isDeleted: false }).populate('comment').exec()
        // res.status(200).json({
        //     success: true,
        //     message: 'Cards data',
        //     data: cards
        // })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,

        })
    }

}

const AddNewCard = async (req, res) => {
    try {
        const {userId}=req.token ;
        const { title, description, assignee } = req.body
        const Card = new CardModel({
            title,
            description,
            author:userId,
        
            
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


const getCardsByListId = async (req, res) => {
    try {
        const { id } = req.params;
        const Card = await CardModel.findOne({ list: id }).exec();
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


const modifyExistingCard = async (req, res) => {
    try {
        const { id } = req.params;
        const {updatedBy} = req.token.userId
        const { title, description, assignee } = req.body;

        const Card = await CardModel.findOneAndUpdate(
            { _id: id },
            {
                title:title,
                description:description,
                assignee:assignee,
                updatedBy:updatedBy
            },
            { new: true }
        ).exec();
        res.status(200).json({
            success: true,
            message: 'Card Updated successfully',
            data: Card
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
const deleteCardFromList = async (req, res) => {
    try {
        const { id } = req.params;

        const Card = await CardModel.findOneAndUpdate(
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



module.exports = { getAllCards,getCardsByListId,AddNewCard,modifyExistingCard,deleteCardFromList }