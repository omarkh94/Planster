const ProjectModel = require("../models/ProjectSchema");
const mongoose = require("mongoose");

function authorization(perm) {
    return async (req, res, next) => {
        try {
            const { projectId, userId } = req.token;

            console.log("Extracted projectId:", projectId);
            console.log("Extracted userId:", userId);
            console.log("Is projectId valid?:", mongoose.Types.ObjectId.isValid(projectId));

            if (!projectId) {
                return res.status(400).json({ success: false, message: "Project ID is missing from the token" });
            }

            if (!mongoose.Types.ObjectId.isValid(projectId)) {
                return res.status(400).json({ success: false, message: `Invalid project ID format: ${projectId}` });
            }

            const project = await ProjectModel.findOne({ _id: projectId })
                .populate({ path: "members.user", select: "name email" })
                .populate({ path: "members.role", select: "permissions name" })
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
            res.status(500).json({ success: false, message: error.message });
        }
    };
}

module.exports = authorization;
