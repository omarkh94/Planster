const TicketModel = require("../models/TicketSchema")
const TeamModel = require("../models/TeamSchema");
const WorkFlowListModel = require("../models/WorkFlowListSchema");
const ProjectModel = require("../models/ProjectSchema");
const mongoose = require("mongoose")




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
        const { userId } = req.token;
        const { projectId, listId, title, description } = req.body;

        if (!mongoose.Types.ObjectId.isValid(listId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid listId format. The ticket must belong to an existing list.",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid projectId format.",
            });
        }

        const list = await WorkFlowListModel.findById(listId);
        if (!list) {
            return res.status(404).json({
                success: false,
                message: "List not found. A ticket must be added to a valid list.",
            });
        }

        const project = await ProjectModel.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        const newTicket = new TicketModel({
            title,
            description,
            author: userId,
            status: list._id, 
            listId: list._id,
            expectedDeadLine: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        const savedTicket = await newTicket.save();

        list.list.push(savedTicket._id);
        await list.save();

        res.status(201).json({
            success: true,
            message: "Ticket added successfully.",
            data: savedTicket,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
  
  


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