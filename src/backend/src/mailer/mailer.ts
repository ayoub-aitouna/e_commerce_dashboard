import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import { log } from 'console';
import i18n from 'i18next';

dotenv.config();


async function initI18n() {
    await i18n.init({
        resources: {
            en: require('../locales/en/translation.json'),
            fr: require('../locales/fr/translation.json'),
            // Add more languages here
        },
        fallbackLng: 'en',
    });
}


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

export const generateEmailTemplate = async (username: string, password: string, url: URL, language: string) => {
    await initI18n();
    i18n.changeLanguage(language);
    console.log('Current language:', i18n.language);
    console.log('Loaded translations:', i18n.store.data);
    console.log('thanks translations:', i18n.t('thanks'));

    return `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                    }
                    p {
                        color: #333;
                    }
                    hr {
                        border: none;
                        border-top: 1px solid #ddd;
                    }
                    a {
                        color: #337ab7;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <p>${i18n.t('greeting')}</p>
                <p>${i18n.t('thanks')}</p>
                <p>Here are all the links you'll need to watch your favorite TV channels with your subscription:</p>
                <p>Xtream Codes:</p>
                <p>Playlist Name: Name</p>
                <p>Username: ${username}</p>
                <p>Password: ${password}</p>
                <p>Host/API/URL: ${getBaseUrl(url)}</p>
                <hr>
                <p>M3U LINK:</p>
                <p>${url.toString()}</p>
                <hr>
                <p>If you need help, do not hesitate to contact us on WhatsApp at: +33</p>
                <p>Please do not hesitate to contact our customer service team if you have any questions or concerns. They are available 24 hours a day, 7 days a week.</p>
                <p>WhatsApp: +33</p>
                <p>Email: contact@gmail.com</p>
                <p>Sincerely,</p>
                <p>The Kingiptv team</p>
                <p><a href="https://site.com">https://site.com</a></p>
            </body>
        </html>
    `;
}
