const ProjectModel = require("../models/ProjectSchema");
const RoleModel = require("../models/RoleSchema"); 

function Authorization(perm) {
    return async (req, res, next) => {
        try {
            const { projectId } = req.body; 
            const { userId } = req.token; 

            
            if (!projectId) {
                return res.status(400).json({ success: false, message: "Bad request: projectId is required" });
            }

            
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized: Missing user ID" });
            }

            
            const project = await ProjectModel.findOne({ _id: projectId })
                .populate({
                    path: "members.user",
                    select: "name email",
                })
                .populate({
                    path: "members.role",
                    select: "permissions name",
                })
                .exec();

           
            if (!project) {
                return res.status(404).json({ success: false, message: "Project not found" });
            }

            
            const member = project.members.find((m) => m.user && m.user._id.toString() === userId);
            if (!member) {
                return res.status(403).json({ success: false, message: "Unauthorized: User is not part of the project" });
            }

            
            const hasPermission = member.role && member.role.permissions.includes(perm);
            if (!hasPermission) {
                return res.status(403).json({ success: false, message: "Unauthorized: Insufficient permissions" });
            }

            next();
        } catch (error) {
            console.error("Authorization error:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    };
}

module.exports = Authorization;
