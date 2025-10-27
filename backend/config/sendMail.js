import nodemailer from 'nodemailer'
import {createTransport} from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config( )
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

// Wrap in an async IIFE so we can use await.
const sendMail =async (to,otp) => {
    await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to: to,
    subject: "Reset Your Password",
    html: `<p>Your OTP For password Reset is <b>${otp}</b>. It expire in 5 minute </p>`, // HTML body
  });

  
}

export default sendMail