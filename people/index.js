import express from "express";
import cors from "cors";
import logger from "morgan";
import db from "./database.js";
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

// get all the people from all the event
app.get("/people/:id", async (req, res) => {
    console.log(`(${process.pid}) People Service: GET /people`);

    // get the event id from the query
    const id = req.params.id;

    // only look for people for one particular event from the database
    const peopleByEventID_document = await db.getPeopleByEventID(id);

    // get the people array from the people document
    const peopleArray = peopleByEventID_document["people"];

    res.send(peopleArray);
})

// sign up a people for a specific event
app.post("/people", async (req, res) => {
    console.log(`(${process.pid}) People Service: POST /people`);

    // get the data from the request body
    const data = req.body.data;
    const { event_id, name, email, isEmailSelected, event } = data;

    // add the new people to the database
    await update(event_id, name, email);

    // send a request to event bus to notify other microservice, email
    try {
        await fetch("http://event-bus:4010/events", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: "PeopleCreated",
                data: {
                    name,
                    email,
                    isEmailSelected,
                    event
                }
            })
        })
    } catch (error) {
        console.log(`(${process.pid}) People Service: ${error}`);
        res.status(500).send({
            status: 'ERROR',
            message: err,
        });
    }

    res.status(201).json(data);
});


async function update(event_id, name, email) {
    // get the people document with the event id 
    const peopleDocument = await db.getPeopleByEventID(event_id);
    console.log(`(${process.pid}) Event Service: ${JSON.stringify(peopleDocument)}`);

    // get the people array from the people document 
    const peopleArrayFromAnEvent = peopleDocument["people"] || [];

    // add a new people to the people array
    peopleArrayFromAnEvent.push({ name, email });

    // update the database with the people array with the newly added people
    await db.insertNewPeopleByEventID({ event_id, people: peopleArrayFromAnEvent });
}


app.post("/events", async (req, res) => {
    const event = req.body;
    const type = event.type;
    console.log(`(${process.pid}) People Service Received Event: ${type}`);
    res.send({});
});

app.listen(3001, () => {
    console.log(`(${process.pid}) People Service: Listening on 3001`);
});
