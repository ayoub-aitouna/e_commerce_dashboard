import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import { log } from 'console';

dotenv.config();


export const SendEmail = async (mailOptions: any) => {
    let transporter = nodemailer.createTransport({
        host: process.env.MAILER_HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.MAILER_USER , // your email
            pass:  process.env.MAILER_PASS // your email password
        },
    });
    mailOptions.from = process.env.MAILER_USER;

    return new Promise((resolve, reject) => {
        log("Sending email to: ", mailOptions.to);
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error occurred while sending email: ', error);
                reject(error);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(info);
            }
        });
    });


} 