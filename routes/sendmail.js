import dotenv from "dotenv";
import nodemailer from "nodemailer"; 

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD,
    },
});

const mailOptions = {
    from: process.env.EMAIL_USER, 
    to: process.env.EMAIL_SENDER,
    subject: "Test Email",
    text: "Hey, this is me",
};

transporter.sendMail(mailOptions)
    .then(info => {
        console.log("Email Sent:", info);
    })
    .catch(error => {
        console.error("Error:", error);
    });