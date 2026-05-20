const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const cors = require('cors')
const express = require("express");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config()

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())

// const uri = process.env.MONGO_URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


let petCollection;
let myListingCollection;
let successStoryCollection;

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const db = client.db('pet-nest')
        petCollection = db.collection('pets')
        myListingCollection = db.collection('my-list')
        successStoryCollection = db.collection('success-stories')


        app.get('/pets', async (req, res) => {
            const result = await petCollection.find().toArray()
            res.json(result)
        })

        app.get('/pets/:id', async (req, res) => {
            const id = req.params.id;

            // Check if it's a valid 24-character hex code before trying to use new ObjectId
            const query = ObjectId.isValid(id)
                ? { $or: [{ _id: id }, { _id: new ObjectId(id) }] }
                : { _id: id };

            const result = await petCollection.findOne(query);
            res.json(result);
        });

        app.post('/pets', async (req, res) => {

            const myAdding = req.body
            const result = await petCollection.insertOne(myAdding)
            res.json(result)
        })

        app.get('/success-storie', async (req, res) => {
            const result = await successStoryCollection.find().toArray()
            res.json(result)
        })
        // app.get('/my-list', async(req, res)=>{
        //     const result = await myListingCollection.find().toArray()
        //     res.json(result)
        // })



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Server is running!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
module.exports = app 