import nodemailer from "nodemailer";
import { google } from "googleapis";

import * as dotenv from 'dotenv';

dotenv.config()  // load environment variables 

// declare authentication variables to connect the gmail API
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// create a google authentication account
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export const sendEmail = async (emailTo, subject, html) => {
    try {
        // access token gets refreshes every 1 hour
        const accessToken = await oAuth2Client.getAccessToken();

        // set up communication channel 
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAUTH2',
                user: "yongyetan1209@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        // specify the mail options
        const mailOptions = {
            from: "yongyetan1209@gmail.com",
            to: emailTo,
            subject: subject,
            html: html
        }
        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error;
    }
};