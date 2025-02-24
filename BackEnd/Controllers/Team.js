const TeamModel = require("../models/TeamSchema")


const getTeamById = async (req, res) => {
    try {
        const { id } = req.params;
        const Card = await TeamModel.findOne({ _id: id }).populate({
            path: 'members'
            , populate: [
                {
                    path: 'user',
                    select: 'firstName lastName email phoneNumber jobTitle _id'

                },
                { path: 'role' }
            ],
        }).select('name members _id ').exec();
        res.status(200).json({
            success: true,
            message: 'Card founded successfully',
            data: Card
        })

    } catch (error) {
        console.log('error :>> ', error);
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const modifyExistingTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const team = await TeamModel.findOneAndUpdate(
            { _id: id },
            {
                name: name,
            },
            { new: true }
        ).exec();
        res.status(200).json({
            success: true,
            message: 'Team Name has been successfully changed',
            data: team
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


const deleteTeamMember = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { membersToDelete } = req.body;

        const team = await TeamModel.findOneAndUpdate(
            { _id: teamId },
            { $pull: { members: { $in: membersToDelete } } },
            { new: true }
        );

        if (!team) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }

        res.status(200).json({
            success: true,
            message: "Member(s) removed successfully",
            data: team,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = { getTeamById, modifyExistingTeam, deleteTeamMember }