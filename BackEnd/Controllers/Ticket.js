const TicketModel = require("../models/TicketSchema")





const getAllTickets = async function (req, res) {
    try {
        res.status(200).json({ success: true });
        const Tickets = await TicketModel.find({ isDeleted: false }).populate('comment').exec()
        res.status(200).json({
            success: true,
            message: 'Tickets data',
            data: Tickets
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,

        })
    }

}

const AddNewTicket = async (req, res) => {
    try {
        const {userId}=req.token ;
        const { title, description, assignee } = req.body
        const Ticket = new TicketModel({
            title,
            description,
            author:userId,
        
            
        })
        const result = await Ticket.save()

        res.status(201).json({
            success: true,
            message: 'Ticket Added successfully',
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


const getTicketsByListId = async (req, res) => {
    try {
        const { id } = req.params;
        const Ticket = await TicketModel.findOne({ list: id }).exec();
        res.status(200).json({
            success: true,
            message: 'Ticket founded successfully',
            data: Ticket
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


const modifyExistingTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const {updatedBy} = req.token.userId
        const { title, description, assignee } = req.body;

        const Ticket = await TicketModel.findOneAndUpdate(
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
            message: 'Ticket Updated successfully',
            data: Ticket
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
const deleteTicketFromList = async (req, res) => {
    try {
        const { id } = req.params;

        const Ticket = await TicketModel.findOneAndUpdate(
            { _id: id },
            {
                isDeleted: true,
            },
            { new: true }
        ).exec();
        res.status(200).json({
            success: true,
            message: 'Ticket deleted successfully',
            data: Ticket
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}



module.exports = { getAllTickets,getTicketsByListId,AddNewTicket,modifyExistingTicket,deleteTicketFromList }