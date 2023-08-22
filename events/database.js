import { MongoClient } from 'mongodb';

const url = 'mongodb://eventadmin:event@events-db:27017';
// const url = 'mongodb://localhost:27017/'
const client = new MongoClient(url);
const dbName = "events-db";
const collectionName = "events";

/*
database
    - collection
        - document 1
        - document 2 
    - collection

*/

/* Mongodb function that I used 
Cheat sheet: (all of these requires async/await)
client = new MongoClient(url).connect() => establish client connection use to  mongo using url
db = client.db(dbName) => connect to the db using the client connection
db.listCollections({ name: collectionName }).toArray() => list out all the collection in the db
db.createCollection(collectionName) => create a collection with <collection name>
db.collection(collectionNam) => get the collection with <collection name>

collection.insertOne(event) => insert a new event to the collection
*/

let events;

const getEventsCollection = async () => {
    // if we haven't connected the collections for the first time
    if (events === undefined) {
        // try to connect it to the database 
        await client.connect();
        const db = client.db(dbName);

        // Check if the event collection exists in the database
        const collections = await db.listCollections({ name: collectionName }).toArray();

        if (collections.length === 0) {
            // Create collection if it does not exist in the database
            await db.createCollection(collectionName);
            console.log(`Created collection: ${collectionName}`);
        }
        // get the events collection and return back
        events = db.collection(collectionName);
    }
    // if we have already connected to the collection, return the event collection
    return events;
};

const getEvents = async () => {
    try {
        // get the event collection
        const collection = await getEventsCollection();

        // get all the documents from the event collection
        const documents = await collection.find({}).toArray();
        return documents || {};
    } catch (error) {
        console.log(error);
    }
}

const insertNewEvent = async (event) => {
    try {
        // get the event collection
        const collection = await getEventsCollection();

        // insert a new event to the event collection
        await collection.insertOne(event);
        
    } catch (error) {
        console.log(error);
    }
};

export default {
    getEvents,
    insertNewEvent,
}
