// routes/InviteRouter.js
const express = require("express");
const nodemailer = require("nodemailer");
const InviteRouter = express.Router();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});

const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
};

InviteRouter.post("/", (req, res) => {
    console.log("Invite API called with:", req.body);
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
        return res.status(400).send({ message: "Please provide a valid email address." });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: email, 
        subject: "You're invited to join the team!",
        text: `Hello,

You’ve been invited to join our team! We’re excited to have you on board.

Click the link below to accept the invitation and get started:
http://192.168.1.24:5173/conversation

If you have any questions, feel free to reach out.

Looking forward to collaborating with you!

Best regards,  
Planster_T01_Team  
PLANSTER`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send({ message: "Failed to send 9999999 invite", error });
        }
        res.status(200).send({ message: "Invite sent successfully" });
    });
});

module.exports = InviteRouter;
