const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
    "mongodb+srv://dkandjsl:9VjkJfRsxTOXASiT@cluster0.fdgt0vl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

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
