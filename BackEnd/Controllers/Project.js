const ProjectModel = require("../models/ProjectSchema")
const TeamModel = require("../models/TeamSchema")
const WorkFlowListModel = require("../models/WorkFlowListSchema")
const TicketModel = require("../models/TicketSchema")
const RoleModel = require("../models/RoleSchema")
const UserModel = require("../models/UserSchema")


const getProjectsList = async function (req, res) {
    try {
        const Project = await ProjectModel.find({ isDeleted: false }).populate('members').exec()
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
const getProjectsBelongsToId = async function (req, res) {
    try {
        const { userId } = req.params
        const user = await UserModel.findOne({ _id: userId })
            .populate({
                path: "projects",
                populate: [
                    { path: "project" },
                    { path: "role" }
                ],
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
        const { userId } = req.token
        const { title, description, expectedDeadLine } = req.body
        // get role (admin)
        const getRole = await RoleModel.findOne({ role: 'admin' });

        if (!getRole) {
            return res.status(404).json({
                success: false,
                message: 'Admin role not found.',
            });
        }


        const createNewTeam = new TeamModel({
            name: title,
            description: 'basic team',
            members: [userId],
        });

        await createNewTeam.save();

        const createNewTicket = new TicketModel({
            title: 'Initial Ticket',
            description: 'Enjoy Planning Your project With Planster',

            author: userId,
            expectedDeadLine,
        });

        const createNewWorkFlowList = new WorkFlowListModel({
            title: 'Backlog',
            author: userId,
        });
        createNewWorkFlowList.list = [createNewTicket._id]

        await createNewWorkFlowList.save();


        createNewTicket.status = createNewWorkFlowList._id

        await createNewTicket.save();

        const newProject = new ProjectModel({
            title,
            description,
            expectedDeadLine,
            projectOwner: userId,
            members: [
                {
                    user: userId,
                    role: getRole._id,
                    teams: [createNewTeam._id],
                },
            ],
            list: [createNewWorkFlowList._id],
        });
        newProject.roomId = newProject._id

        await UserModel.findByIdAndUpdate(userId, {
            $push: {
                projects: {
                    project: newProject._id,
                    role: getRole._id
                }
            }
        })

        const result = await newProject.save();
        console.log('ss', result);
        res.status(201).json({
            success: true,
            message: 'Project added successfully',
            data: result,
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



//  getProjectsList,

module.exports = { getProjectsById, AddNewProject, ModifyProject, DeleteProject, getProjectsBelongsToId, projectMembers }