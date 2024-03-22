require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(process.env.DB_URI);

async function connect() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Connected to DB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the application if failed to connect to MongoDB
    } finally {
        await client.close();
    }
}

module.exports = {
    connect,
    client,
};
