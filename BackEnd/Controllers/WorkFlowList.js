const ProjectModel = require("../models/ProjectSchema")
const WorkFlowListModel = require("../models/WorkFlowListSchema")
const TicketModel = require("../models/TicketSchema")
const UserModel = require("../models/UserSchema")




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


        const { title, userId, projectId, expectedDeadLine } = req.body;
        if (!title || !userId || !projectId || !expectedDeadLine) {
            return res.status(400).json({
                success: false,
                message: `Bad request: ${title} and ${userId} and ${projectId} and ${expectedDeadLine}are required`
            });
        }

        const createNewWorkFlowList = new WorkFlowListModel({
            title: title,
            author: userId,
        });

        await createNewWorkFlowList.save();

        const createNewTicket = new TicketModel({
            title: 'Initial Ticket',
            description: 'Enjoy Planning Your project With Planster',
            status: createNewWorkFlowList._id,
            author: userId,
            expectedDeadLine: expectedDeadLine,
        });

        await createNewTicket.save();

        await WorkFlowListModel.findOneAndUpdate(
            { _id: createNewWorkFlowList._id },

            { $push: { list: createNewTicket._id } },

            { new: true }
        ).exec()

        await ProjectModel.findOneAndUpdate(
            { _id: projectId },
            { $push: { list: createNewWorkFlowList._id } },
            { new: true }
        ).exec();

        res.status(201).json({
            success: true,
            message: 'WorkFlowList Added successfully',
            data: createNewWorkFlowList
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
        const { projectId } = req.params;
        const WorkFlowList = await WorkFlowListModel.find({ project: projectId }).exec();
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







const reorderLists = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { updatedListOrder } = req.body;

        if (!Array.isArray(updatedListOrder)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request format: expected array of list IDs"
            });
        }

        const project = await ProjectModel.findById(projectId)
            .select('list')
            .lean();

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        const existingListIds = project.list.map(id => id.toString());

        const isValidOrder = updatedListOrder.every(id =>
            existingListIds.includes(id.toString())
        ) && updatedListOrder.length === existingListIds.length;

        if (!isValidOrder) {
            return res.status(400).json({
                success: false,
                message: "Invalid list order: contains unknown IDs or length mismatch"
            });
        }

        const updatedProject = await ProjectModel.findByIdAndUpdate(
            projectId,
            { $set: { list: updatedListOrder } },
            { new: true, runValidators: true }
        ).populate('list', 'title');

        res.status(200).json({
            success: true,
            project: updatedProject
        });

    } catch (error) {
        console.error("Error reordering lists:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};
// router.put("/projects/:projectId/reorder-lists", reorderLists);
// const reorderTickets = async (req, res) => {
//     try {
//         const { projectId } = req.params;
//         const {
//             /*sourceListId,
//             destinationListId,
//             sourceIndex,
//             destinationIndex, */
//             project

//         } = req.body;


//         if(!project){return}
//         const result = await ProjectModel.findByIdAndUpdate(
//             { _id: projectId },
//             {
//                 list: project.list,
//             },
//             { new: true }).populate(
//             {
//                 path: 'list',
//                 populate: { path: 'list' }
//             }
//         ).exec()
//         res.status(200).json({
//             success: true,
//             sourceList: updatedProject.list.id(sourceListId),
//             destList: updatedProject.list.id(destinationListId),
//             data : result
//         })
//     } catch (error) {
//         console.error("Ticket reordering error:", error);
//         res.status(500).json({
//             success: false,
//             message: error.message || "Server error"
//         });
//     }

    //     if (!sourceListId || !destinationListId ||
    //         typeof sourceIndex !== 'number' || typeof destinationIndex !== 'number') {
    //         return res.status(400).json({
    //             success: false,
    //             message: "Invalid request parameters"
    //         });
    //     }

    //     const projectt = await ProjectModel.findById(projectId)
    //         .select('list')
    //         .populate({
    //             path: 'list',
    //             populate: { path: 'list' }
    //         });

    //     if (!projectt) {
    //         return res.status(404).json({
    //             success: false,
    //             message: "Project not found"
    //         });
    //     }

    //     const projectObj = projectt.toObject();

    //     const sourceList = projectObj.list.find(l => l._id.toString() === sourceListId);
    //     const destList = projectObj.list.find(l => l._id.toString() === destinationListId);

    //     if (!sourceList || !destList) {
    //         return res.status(404).json({
    //             success: false,
    //             message: "Source or destination list not found"
    //         });
    //     }

    //     const [movedTicket] = sourceList.list.splice(sourceIndex, 1);

    //     destList.list.splice(destinationIndex, 0, movedTicket);

    //     await ProjectModel.updateOne(
    //         { _id: projectId, "list._id": sourceListId },
    //         { $set: { "list.$.list": sourceList.list } }
    //     );

    //     await ProjectModel.updateOne(
    //         { _id: projectId, "list._id": destinationListId },
    //         { $set: { "list.$.list": destList.list } }
    //     );

    //     const updatedProject = await ProjectModel.findById(projectId)
    //         .populate({
    //             path: 'list',
    //             populate: { path: 'list' }
    //         });

    //     res.status(200).json({
    //         success: true,
    //         sourceList: updatedProject.list.id(sourceListId),
    //         destList: updatedProject.list.id(destinationListId)
    //     });

    // } catch (error) {
    //     console.error("Ticket reordering error:", error);
    //     res.status(500).json({
    //         success: false,
    //         message: error.message || "Server error"
    //     });
    // }
// };
const reorderTickets = async (req, res) => {
    try {
        const { sourceListId, destinationListId, sourceIndex, destinationIndex } = req.body;
        const { projectId } = req.params;

        // Find source and destination lists
        const sourceList = await ListModel.findById(sourceListId);
        const destinationList = await ListModel.findById(destinationListId);

        if (!sourceList || !destinationList) {
            return res.status(404).json({ success: false, message: "Source or destination list not found" });
        }

        // Extract the ticket ID from the source list
        const [movedTicketId] = sourceList.list.splice(sourceIndex, 1);
        destinationList.list.splice(destinationIndex, 0, movedTicketId);

        // Update the ticket's status if necessary (optional)
        const ticket = await TicketModel.findById(movedTicketId);
        if (ticket) {
            ticket.status = destinationListId;
            await ticket.save();
        }

        // Save the updated lists
        await sourceList.save();
        await destinationList.save();

        // Fetch the updated project with populated lists
        const updatedProject = await ProjectModel.findById(projectId)
            .populate({
                path: 'list',
                populate: { path: 'list' }
            });

        res.status(200).json({
            success: true,
            data: updatedProject
        });
    } catch (error) {
        console.error("Ticket reordering error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};



module.exports = { getAllWorkFlowLists, addNewWorkFlowList, getWorkFlowListsByProjectId, reorderLists, reorderTickets, modifyWorkFlowList, deleteWorkFlowList };