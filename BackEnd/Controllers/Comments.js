
const CommentsModel = require('../models/CommentsSchema');
const CardModel = require('../models/CardSchema');

const getCommentsByCard = async function (req, res) {
    try {
        const cardID = req.params.cardID;

        const card = await CardModel.findOne({ _id: cardID }).populate('comments').exec();

        if (!card) {
            return res.status(404).json({
                success: false,
                message: 'Card not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Comments data',
            data: card.comments,
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
        const { description, cardID } = req.body;
        const comment = new CommentsModel({
            description,
            commenter: userId,
        })
        await comment.save()
        const result = await CardModel.findByIdAndUpdate(cardID, {
            $push: {
                comments: comment._id
            }
        }, { new: true })

        res.status(201).json({
            success: true,
            message: 'Comment created successfully',
            data: result
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
        const Comments = await CommentsModel.findOne({ commenter: userId }).exec();
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
        const {commentId} = req.params;
        console.log('commentId :>> ', commentId);
        const { description } = req.body;
        console.log('description :>> ', description);

        const comment = await CommentsModel.findById(commentId).exec();
        console.log('comment :>> ', comment);

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


module.exports = { getCommentsByCard, AddNewComment, getCommentByCommenter, modifyCommentByCommenter, deleteCommentByCommenter };