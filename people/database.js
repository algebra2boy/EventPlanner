import { MongoClient } from 'mongodb';

const url = 'mongodb://people:password@people-db:27017';
// const url = 'mongodb://localhost:27017/'
const client = new MongoClient(url);
const dbName = "people-db";
const collectionName = "people";

let people;

const getPeopleCollection = async () => {

    // if we haven't connected the collections for the first time
    if (people === undefined) {

        // try to connect it to the database 
        await client.connect();
        const db = client.db(dbName);

        // Check if the people collection exists in the database
        const collections = await db.listCollections({ name: collectionName }).toArray();

        if (collections.length === 0) {

            // Create collection if it does not exist in the database
            await db.createCollection(collectionName);
            console.log(`Created collection: ${collectionName}`);
        }
        
        // get the events collection and return back
        people = db.collection(collectionName);
    }
    
    // if we have already connected to the collection, return the event collection
    return people;
};

// returns the document that belongs to that eventid 
// the document should have the eventid and an array of people with their name and email
const getPeopleByEventID = async (event_id) => {
    try {
        // get the people collection
        const collection = await getPeopleCollection();

        // get the document with the event id from the collection
        const document = await collection.findOne({ event_id: event_id });
        return document || {};
    } catch (error) {
        console.log(error);
    }
}

const insertNewPeopleByEventID = async (peopleWithEventId) => {
    try {
        // get the event id from the passing object
        const event_id = peopleWithEventId["event_id"];

        // get the people collection
        const collection = await getPeopleCollection();

        // get the document that associates with the event id
        const document = await getPeopleByEventID(event_id);

        // first time inserting the document 
        if (JSON.stringify(document) === JSON.stringify({})) {
            await collection.insertOne(peopleWithEventId);
        } else {
            // there is an existing document, overwritting the old people array with the new people array
            await collection.updateOne(
                { event_id: event_id },
                {
                    $set: { people: peopleWithEventId["people"] }
                }
            );
        }
    } catch (error) {
        console.log(error);
    }
};

export default {
    getPeopleByEventID,
    insertNewPeopleByEventID,
}
