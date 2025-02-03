const ProjectModel = require("../models/ProjectSchema")
const TeamModel = require("../models/TeamSchema")
const TeamRoleModel = require("../models/TeamRoleSchema")
function authorization(perm) {
    return async (req, res, next) => {
        try {
            const { projectId, userId } = req.token;

            const project = await ProjectModel.findOne({ _id: projectId }).exec();
            console.log('project :>> ', project);
            if (!project) {
                return res.status(404).json({ success: false, message: "Project not found" });
            }

            const team = await TeamModel.findOne({ _id: project.team })
                .populate({
                    path: "members.user",
                    select: "name email",
                })
                .populate({
                    path: "members.role",
                    select: "permissions name",
                })
                .exec();

            if (!team) {
                return res.status(404).json({ success: false, message: "Team not found" });
            }

            const member = team.members.find((m) => m.user && m.user._id.toString() === userId);
            if (!member) {
                return res.status(403).json({ success: false, message: "Unauthorized: User is not part of the team" });
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
module.exports = authorization



