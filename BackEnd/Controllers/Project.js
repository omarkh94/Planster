const ProjectModel = require("../models/ProjectSchema")
const TeamModel = require("../models/TeamSchema")
const WorkFlowListModel = require("../models/WorkFlowListSchema")
const TicketModel = require("../models/TicketSchema")
const RoleModel = require("../models/RoleSchema")


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



const AddNewProject = async (req, res) => {
    try {
        const { userId } = req.token
        const { title, description, expectedDeadLine } = req.body

        const getRole = await RoleModel.find({ role: 'admin' });

        if (getRole.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Admin role not found.',
            });
        }

        const { _id: RoleId } = getRole[0];

        const createNewTeam = new TeamModel({
            name: title,
            description: 'basic team',
            members: [userId],  
          });
          
        await createNewTeam.save();

        const createNewWorkFlowList = new WorkFlowListModel({
            title: 'Backlog', 
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
        


        const Project = new ProjectModel({
            title,
            description,
            expectedDeadLine,
            team: createNewTeam._id,
            members: [{ user: userId, role: RoleId }],
            projectOwner: userId,
            list: [createNewWorkFlowList._id], 
        });

        const result = await Project.save();

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
        const { title, description, expectedDeadLine, team, projectOwner, list } = req.body;

        const project = await ProjectModel.findOneAndUpdate(
            { _id: id },
            {
                title: title,
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



const projectMembers = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const projects = await ProjectModel.find({ _id: projectId, isDeleted: false })
            .populate('members')
            .exec();

        const members = [...new Set(projects.flatMap((project) =>
            project.members?.map((member) => member.user?._id).filter(Boolean) || []
        ))];

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





module.exports = { getProjectsList, getProjectsById, AddNewProject, ModifyProject, DeleteProject ,projectMembers}