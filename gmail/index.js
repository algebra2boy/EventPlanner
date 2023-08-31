import express from 'express';
import cors from "cors";
import logger from 'morgan';
import { sendEmail } from "./email.js";
import customLogger from "./winstonLogger.js";
import expressWinston from "express-winston";

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

// implement our custom logger to the express app
app.use(expressWinston.logger({
    winstonInstance: customLogger,
    statusLevels: true
}));

// email post service to send an email remainder to user
app.post("/email", async (req, res) => {
    console.log(`(${process.pid}) Email Service: POST /email`);

    if (!req.body) {
        res.status(400).json({
            "error": "The request is missing body parameter"
        });
        return;
    }
    const data = req.body.data;
    const { name, email, event } = data;
    const emailTo = email;
    const subject = `You have been invited to ${event.eventName}!!`;
    const html = `
    <h1>Hello ${name}!</h1>
    <h1>Remainder:</h1>
    <h2>Event name: ${event.eventName}</h2>
    <h4>Date: ${event.startDateString}-${event.endDateString}</h4>
    <h4>Where to meet: ${event.locationName}</h4>
    <p>Location details: ${event.locationDetails}</p>
    <p>Thank you for signing up!</p>`

    // sending the email (<- this is where the magic happens)
    const result = await sendEmail(emailTo, subject, html);

    console.log(`result after an email to ${emailTo}: ${JSON.stringify(result)}`)
    res.send(result);
});

// accept event from the event bus
app.post("/events", async (req, res) => {
    const event = req.body;
    const type = event.type;
    const data = event.data;
    const isEmailSelected = data.isEmailSelected;
    console.log(`(${process.pid}) Gmail Service Received Event: ${type}`);

    // if a people has signed up, then send an email to the person to notify them
    if (type === "PeopleCreated" && isEmailSelected) {
        await fetch("http://gmail:3002/email", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: "PeopleCreated",
                data: data
            })
        })
    }

    res.send({});
});

app.listen(3002, () => {
    console.log(`(${process.pid}) Gmail Service: Listening on 3002`);
});