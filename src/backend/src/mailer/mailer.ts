// import nodemailer from 'nodemailer';

// let transporter = nodemailer.createTransport({
//     host: 'your-smtp-server.com',
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: 'your-email@example.com', // your email
//         pass: 'your-email-password' // your email password
//     },
// });

// let mailOptions = {
//     from: 'your-email@example.com',
//     to: email, // recipient's email, comes from req.body
//     subject: 'Product Purchase Confirmation',
//     text: 'Thank you for purchasing our product.', // plain text body
//     html: '<b>Thank you for purchasing our product.</b>', // html body
// };

// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         console.log('Error occurred while sending email: ', error);
//     } else {
//         console.log('Email sent: ' + info.response);
//     }
// });