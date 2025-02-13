
const CommentsModel = require('../models/CommentsSchema');
const TicketModel = require('../models/TicketSchema');

const getCommentsByTicket = async function (req, res) {
    try {
        const TicketID = req.params.TicketID;

        const Ticket = await TicketModel.findOne({ _id: TicketID }).populate('comments').exec();

        if (!Ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Comments data',
            data: Ticket.comments,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};



const AddNewComment = async (req, res) => {

    try {

        const { userId } = req.token;
        const { description, TicketID } = req.body;
        const comment = new CommentsModel({
            description,
            commenter: userId,
        })
        await comment.save()

        const result = await TicketModel.findByIdAndUpdate(TicketID, {
            $push: {
                comments: comment._id
            }
        }, { new: true }).populate("comments");

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: updatedTicket
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


const getCommentByCommenter = async (req, res) => {
    try {
        const { userId } = req.token;
        const Comments = await CommentsModel.find({ commenter: userId }).exec();
        if (!Comments) {
            return res.status(404).json({
                success: false,
                message: 'no comments found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Comments Loaded Successfully',
            data: Comments
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


const modifyCommentByCommenter = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { description } = req.body;

        const comment = await CommentsModel.findById(commentId).exec();

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
            });
        }

        if (comment.commenter.toString() !== req.token.userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to modify this comment',
            });
        }

        comment.description = description;
        await comment.save();

        res.status(200).json({
            success: true,
            message: 'Comment updated successfully',
            data: comment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteCommentByCommenter = async (req, res) => {
    try {
        const { commentId } = req.params;


        const comment = await CommentsModel.findById(commentId).exec();

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
            });
        }

        if (comment.commenter.toString() !== req.token.userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to modify this comment',
            });
        }

        comment.isDeleted = true;
        await comment.save();

        res.status(200).json({
            success: true,
            message: 'Comment Deleted successfully',
            data: comment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = { getCommentsByTicket, AddNewComment, getCommentByCommenter, modifyCommentByCommenter, deleteCommentByCommenter };