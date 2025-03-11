import dotenv from "dotenv";
import nodemailer from "nodemailer"; 
import jwt from "jsonwebtoken";
import User from "usermodel.js"
import express from "express";
import fs from "fs";

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
    to: process.env.EMAIL_USER,
    subject: "Test Email",
    text: "Hey, this is me",
};

// Send mail
transporter.sendMail(mailOptions)
    .then(info => {
        console.log("Email Sent:", info);
    })
    .catch(error => {
        console.error("Error:", error);
    });