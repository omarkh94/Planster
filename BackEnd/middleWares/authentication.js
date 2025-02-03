const jwt = require('jsonwebtoken')
require('dotenv').config();

const authentication = (req, res, next) => {
    const token = req?.headers?.authorization?.split('Bearer ').pop()
    const { projectId } = req.body
    const { projectId: projectParams } = req.params
    if (!token) {

        res.status(403).json({
            success: false,

            message: "Forbidden"
        })
    }
    try {

        const verifiedToken = jwt.verify(token, process.env.SECRET);

        if (Object.keys(verifiedToken)?.length > 0) {

            req.token = {
                ...verifiedToken, projectId: projectParams ?? projectId ?? ''
            }
            next()
        }
        else {
            res.status(403).json({
                success: false,
                message: "Forbidden"
            })
        }
    } catch (error) {
        res.status(403).json({
            success: false,
            message: "The token is invalid or expired"
        })
    }

}

module.exports = authentication


