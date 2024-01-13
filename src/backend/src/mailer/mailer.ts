import nodemailer from 'nodemailer';


export const SendEmail = async (mailOptions: any) => {
    let transporter = nodemailer.createTransport({
        host: 'your-smtp-server.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'your-email@example.com', // your email
            pass: 'your-email-password' // your email password
        },
    });
    mailOptions.from = 'your-email@example.com';

    return new Promise((resolve, reject) => {
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