import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import { log } from 'console';
import { languageEnum, languageSettings } from '../languages';

dotenv.config();


export const SendEmail = async (mailOptions: any) => {
    let transporter = nodemailer.createTransport({
        host: process.env.MAILER_HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.MAILER_USER, // your email
            pass: process.env.MAILER_PASS // your email password
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

function getBaseUrl(url: URL) {
    return `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`;
}



/**
 * Generates an email template with the provided information.
 * 
 * @param username - The username of the customer.
 * @param password - The password of the customer.
 * @param url - The URL of the website.
 * @param site - The name of the website.
 * @param language - The language of the email.
 * @param phone - The phone number of the customer service.
 * @param email - The email address of the customer service.
 * @returns The generated email template as a string.
 */
export const generateEmailTemplate = async (
    username: string,
    password: string,
    url: URL,
    site: string,
    language: languageEnum,
    phone: string,
    email: string,
    Update: boolean = false
) => {
    const translate = (key: string) => languageSettings[language][key] || key;
    const referenceSiteUrl = new URL(site);

    return `
        <html>
        <head>
            <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #000;
            }
    
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            h1, h2, h3, h4, h5, h6 {
                color: #333;
                margin-bottom: 10px;
            }
    
            p {
                color: #555;
                margin-bottom: 15px;
                line-height: 1.6;
            }
    
            hr {
                border: none;
                border-top: 1px solid #ddd;
                margin: 20px 0;
            }
    
            a {
                color: #337ab7;
                text-decoration: none;
            }
    
            .contact-icon {
                color: #337ab7;
                font-size: 20px;
                margin-right: 5px;
            }
            .indint {
                text-indent: 20px;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <h2>${translate("greeting")}</h2>
            <p>${translate("orderSummarypart1")} ${referenceSiteUrl.hostname} ${translate("orderSummarypart2")}</p>
            <p>${translate("linksInfo")}</p>
            <p>${translate("xtreamCodes")}</p>
            ${Update ? `
            <p>${translate("UpdatedDns")}</p>
            <p class="indint" >${translate("dnsLabel")} ${url}</p>
            `:
            `
            <p class="indint" >${translate("playlistName")} ${referenceSiteUrl.hostname.split('.')[1]}</p>
            <p class="indint" >${translate("usernameLabel")} ${username}</p>
            <p class="indint" >${translate("passwordLabel")} ${password}</p>
            <p class="indint" >${translate("hostApiUrlLabel")} ${getBaseUrl(url)}</p>
            <hr>
            <p>${translate("m3uLink")}</p>
            <p class="indint" >${url.toString()}</p>
            <hr>
        `}



                <p>${translate("helpContact")} ${phone}</p>
                <p>${translate("customerServiceInfo")}</p>
                <p>
                    <span class="contact-icon">&#9742;</span> ${translate("whatsappLabel")} ${phone}
                </p>
                <p>
                    <span class="contact-icon">&#9993;</span> ${translate("emailLabel")} ${email}
                </p>
                <p>${translate("signature")}</p>
                <p>${translate("teamName")}</p>
                <p><a href="${site}">${site}</a></p>
            </div>
        </body>
        </html>
    `;
};
