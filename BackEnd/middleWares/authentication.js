// authentication.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authentication = (req, res, next) => {
    const token = req?.headers?.authorization?.split('Bearer ').pop();

    if (!token) {
        return res.status(403).json({
            success: false,
            message: "Forbidden"
        });
    }







    try {
        const verifiedToken = jwt.verify(token, process.env.SECRET);

        if (Object.keys(verifiedToken)?.length > 0) {
            req.token = verifiedToken;
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: "Forbidden"
            });
        }
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "The token is invalid or expired",
            data: error.message
        });
    }
};

module.exports = authentication;


