const ProjectModel = require("../models/ProjectSchema")
const TeamModel = require("../models/TeamSchema")
const WorkFlowListModel = require("../models/WorkFlowListSchema")
const TicketModel = require("../models/TicketSchema")
const RoleModel = require("../models/RoleSchema")
const UserModel = require("../models/UserSchema")



const getProjectsToUser = async function (req,
    res) {
    try {
        const { userId } = req.params
        const user = await UserModel.findOne({ _id: userId })
            .populate({
                path: "projects",
                populate: [
                    { path: "team" },
                    { path: "projectOwner" },
                ]

            }).select('projects')
            .exec();

        console.log('user :>> ', user);
        res.status(200).json({
            success: true,
            message: 'Projects data',
            data: user
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
        const { userId } = req.token;
        const { title, description, expectedDeadLine } = req.body;

        // Get role (admin)
        const getRole = await RoleModel.findOne({ role: 'admin' });

        if (!getRole) {
            return res.status(404).json({
                success: false,
                message: 'Admin role not found.',
            });
        }

        // Create New Team for Project
        const createNewTeam = new TeamModel({
            name: title,
            description: 'Basic team',
            members: [{
                user: userId,
                role: getRole._id
            }],
        });
        await createNewTeam.save();

        // Create Initial Ticket
        const createNewTicket = new TicketModel({
            title: 'Initial Ticket',
            description: 'Enjoy planning your project with Planster',
            author: userId,
            expectedDeadLine,
        });
        await createNewTicket.save(); // Ensure the ticket exists before using its ID

        // Create Initial List (WorkFlow)
        const createNewWorkFlowList = new WorkFlowListModel({
            title: 'Backlog',
            author: userId,
            list: [createNewTicket._id], // Add ticket ID to list
        });
        await createNewWorkFlowList.save();

        // Update ticket status with the workflow list ID
        createNewTicket.status = createNewWorkFlowList._id;
        await createNewTicket.save();

        // Create Project
        const newProject = new ProjectModel({
            title,
            description,
            expectedDeadLine,
            projectOwner: userId,
            team: createNewTeam._id,
            list: [createNewWorkFlowList._id],
        });

        newProject.roomId = newProject._id;
        await newProject.save();

        // Push project into the user's projects array
        await UserModel.findByIdAndUpdate(userId, {
            $push: { projects: newProject._id },
        });

        res.status(201).json({
            success: true,
            message: 'Project added successfully',
            data: newProject,
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the project.',
        });
    }
};

const getProjectsById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await ProjectModel.findOne({ _id: projectId }).populate({
            path: "list",
            populate: {
                path: "list",
            },
        }).exec();
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
        const { listOrder, ...updatedData } = req.body;

        // Validate project existence
        const existingProject = await ProjectModel.findById(id);
        if (!existingProject) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // If listOrder is provided, update the list order
        if (listOrder) {
            // Verify list order matches existing lists
            if (listOrder.length !== existingProject.list.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid list order provided'
                });
            }

            // Reorder lists while maintaining full objects
            const orderedLists = listOrder.map(id =>
                existingProject.list.find(list => list._id.toString() === id)
            ).filter(Boolean);

            updatedData.list = orderedLists;
        }

        const updatedProject = await ProjectModel.findByIdAndUpdate(
            id,
            { $set: updatedData },
            { new: true, runValidators: true }
        ).populate('members.user', 'username email');

        if (!updatedProject) {
            return res.status(404).json({
                success: false,
                message: 'Project not found after update'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            data: updatedProject
        });

    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === 'production'
                ? 'Server error'
                : error.message
        });
    }
};
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



const projectMembers = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const projects = await ProjectModel.find({ _id: projectId, isDeleted: false })
            .populate('members')
            .exec();

        // const members = [...new Set(projects.flatMap((project) =>
        //     project.members?.map((member) => member.user?._id).filter(Boolean) || []
        // ))];

        res.status(200).json({
            success: true,
            message: "Projects data retrieved successfully",
            data: members,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const addNewListIntoProject = async (req, res) => {
    try {
        const { userId } = req.token
        const { projectId } = req.params
        const { title, } = req.body;
        if (!title || !userId || !projectId) {
            return res.status(400).json({
                success: false,
                message: `Bad request: ${title} and ${userId} and ${projectId} are required`
            });
        }
        const createNewTicket = new TicketModel({
            title: 'Initial Ticket',

            author: userId,
        });

        const createNewWorkFlowList = new WorkFlowListModel({
            title: title,
            author: userId,
            list: [createNewTicket._id]
        });
        createNewTicket.status = createNewWorkFlowList._id
        await createNewTicket.save();
        await createNewWorkFlowList.save();


        await ProjectModel.findOneAndUpdate(
            { _id: projectId },
            { $push: { list: createNewWorkFlowList._id } },
            { new: true }
        ).exec();
        const response = await ProjectModel.findOne({ _id: projectId }).populate({
            path: "list",
            populate: {
                path: "list",
            },
        }).exec();
        res.status(201).json({
            success: true,
            message: 'WorkFlowList Added successfully',
            data: response
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const addCardToList = async (req, res) => {
    try {
        const { projectId } = req.params
        const { userId } = req.token
        const { title, description, listId } = req.body
        const createNewTicket = new TicketModel({
            title,
            description,
            status: listId,
            author: userId,
        });
        await createNewTicket.save()

        await WorkFlowListModel.findByIdAndUpdate(listId,
            { $addToSet: { list: createNewTicket._id } }
        )
        const response = await ProjectModel.findById(projectId).populate({
            path: "list",
            populate: {
                path: "list",
            },
        }).exec();
        res.status(201).json({
            success: true,
            message: 'Card Added successfully',
            data: response
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}



module.exports = {
    getProjectsById,
    AddNewProject,
    ModifyProject,
    DeleteProject,
    getProjectsToUser,
    projectMembers,
    addNewListIntoProject,
    addCardToList
}