import express from "express";
import logger from "morgan";
import customLogger from "./winstonLogger.js";
import expressWinston from "express-winston";

const app = express();

app.use(logger('dev'));
app.use(express.json());

// implement our custom logger to the express app
app.use(expressWinston.logger({
    winstonInstance: customLogger,
    statusLevels: true
}));

const servicePorts = [
    { "name": "events", port: 3004 },
    { "name": "gmail", port: 3002 },
    { "name": "people", port: 3001 },
    { "name": "yelp", port: 3003 },
]

app.get("/hello", (req, res) => {
    res.send("HELLO");
});

app.post("/events", async (req, res) => {
    // the type of the event from each microservice
    const event = req.body;

    console.log(`(${process.pid}) Event Bus (Received Event) ${event.type}`);

    // iterate over and send request to each microservice
    for (const { name, port } of servicePorts) {
        try {
            console.log(`(${process.pid}) Event Bus (Sending Event) ${event.type}`);
            await fetch(`http://${name}:${port}/events`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event)
            })

        } catch (error) {
            console.log(error);
        }
    }

    res.send({ status: 'OK' });
})

app.listen(4010, () => {
    console.log(`(${process.pid}) Event Bus Listening on 4010`);
})