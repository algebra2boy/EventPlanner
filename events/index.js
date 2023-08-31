import express from "express";
import cors from "cors";
import logger from "morgan";
import customLogger from "./winstonLogger.js";
import expressWinston from "express-winston";
import { checkValidParameter } from "./helper.js";
import { v4 as uuidv4 } from 'uuid';
import db from "./database.js";


const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

// implement our custom logger to the express app
app.use(expressWinston.logger({
    winstonInstance: customLogger,
    statusLevels: true
}));

// get all the events in the database
app.get("/eventPlans", async (req, res) => {
    console.log(`(${process.pid}) Events Service: GET /eventPlans`);
    const events = await db.getEvents();
    res.send(events);
})

// create a new event
app.post("/eventPlans", async (req, res) => {
    console.log(`(${process.pid}) Events Service: POST /eventPlans`);

    // get the data from the request body
    const data = req.body.data;

    if (data === undefined) {
        res.status(400).json({
            "error": "The request is missing body parameter"
        });
        return;
    }

    // check missing body parameter
    const checkResult = checkValidParameter(data);

    if (checkResult !== "Ok") {
        res.status(400).json({
            "error": checkResult
        })
        return;
    }

    // get the db and save the newest event to the database
    const events = await db.getEvents();

    const id = uuidv4();
    events[id] = { "event_id": id, data };
    await db.insertNewEvent(events[id]);

    // send a request to event bus to notify other microservice 
    // body has been formatted using JSON.stringfy otherwise it is not considered as JSON
    try {
       const response = await fetch("http://event-bus:4010/events", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: "EventCreated",
                data: {
                    id,
                    data
                }
            })
        })
        console.log(`response from event bus ${JSON.stringify(response)})`);
    } catch (error) {
        console.log(`(${process.pid}) Events Service: ${error}`);
        res.status(500).send({
            status: 'ERROR',
            message: error,
        });
        return;
    }

    // return that specific event
    res.status(201).json(events[id]);
})

// accept event from the event bus
app.post("/events", async (req, res) => {
    const event = req.body;
    const type = event.type;
    console.log(`(${process.pid}) Events Service Received Event: ${type}`);
    res.send({});
});


app.listen(3004, () => {
    console.log(`(${process.pid}) Events Service: Listening on 3004`);
});