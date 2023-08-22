import express from "express";
import cors from "cors";
import logger from "morgan";
import * as dotenv from 'dotenv';
import customLogger from "./logs/winstonLogger.js";
import expressWinston from "express-winston";

dotenv.config()  // load environment variables 

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

// implement our custom logger to the express app
app.use(expressWinston.logger({
    winstonInstance: customLogger,
    statusLevels: true
}));

app.post("/business", async (req, res) => {
    console.log(`(${process.pid}) Yelp Service: GET /business`);

    // missing request body
    if (!req.body) {
        res
            .status(400)
            .json({
                "error": "The request is missing body"
            })
    }

    // get the baseURL by feeding the request body
    const baseURL = getBaseAPI(req.body.data);

    // try to get the response by sending a fetch API to yelp
    try {
        const response = await sendRequestToYelpAPI(baseURL);

        if (!response.ok) {
            const errorData = await response.json();
            // return the yelp internal response status 
            // would help us quickly identify where went wrong
            return res
                .status(response.status)
                .send(errorData);
        }

        const data = await response.json();
        res
            .status(201)
            .send(data);

    } catch (error) {
        res
            .status(500)
            .json({
                "error": error
            });
    }
})

// accept event from the event bus
app.post("/events", async (req, res) => {
    const event = req.body;
    const type = event.type;
    console.log(`(${process.pid}) Yelo Service Received Event: ${type}`);
    res.send({});
})

// format the baseAPI using user provided paramter
function getBaseAPI(data) {
    const { location, limit, sort_by, term, price } = data;
    let baseURL = "https://api.yelp.com/v3/businesses/search?";
    baseURL += `location=${location}&limit=${limit}&sort_by=${sort_by}&term=${term}&price=${price}`;
    return baseURL;
}

// send the request to yelp API with the bearer token
async function sendRequestToYelpAPI(API_link) {
    const YELP_APIKEY = process.env.YELP_APIKEY;
    const response = await fetch(API_link, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${YELP_APIKEY}`,
        },
    });
    return response;
}


app.listen(3003, () => {
    console.log(`(${process.pid}) Yelp Service: Listening on 3003`);
});