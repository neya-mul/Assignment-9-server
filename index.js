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
let adoptionCollection;

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
        adoptionCollection = db.collection('adoption-request')


        app.get('/pets', async (req, res) => {
            const { ownerId, species, searchName } = req.query;
            // const query = ownerId ? { ownerId: ownerId } : {};
            const query = {}
            if (ownerId) {
                query.ownerId = ownerId
            }

            if (searchName) {
                query.petName = { $regex: searchName, $options: 'i' }
            }

            if(species){
                query.species = {$in: species.split(',')}
            }
            const result = await petCollection.find(query).toArray();
            res.json(result);
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

        app.get('/pets', async (req, res) => {
            const ownerId = req.params.ownerId
            const result = await petCollection.find({ ownerId: new ObjectId(ownerId) }).toArray()
            res.json(result)
        })

        app.patch('/pets/:id', async (req, res) => {
            const { id } = req.params
            const updatedData = req.body
            const result = petCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedData }
            )
            res.json(result)
        })
        app.delete('/pets/:id', async (req, res) => {
            const { id } = req.params
            const deletedData = req.body
            const result = petCollection.deleteOne({ _id: new ObjectId(id) })
            res.json(result)
        })


        app.post('/adoption-requests', async (req, res) => {
            const result = await adoptionCollection.insertOne(req.body)
            res.json(result)
        })

        app.get('/adoption-requests', async (req, res) => {
            const { adopterId } = req.query;
            const query = adopterId ? { adopterId: adopterId } : {};
            const result = await adoptionCollection.find(query).toArray();
            res.json(result);
        })
        // Add :id to the path string so req.params.id works!
        app.patch('/adoption-requests/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const result = await adoptionCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: req.body }
                );
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        app.get('/adoption-requests/pet/:petId', async (req, res) => {
            const { petId } = req.params
            const result = await adoptionCollection.find({ petId: petId }).toArray()
            res.json(result)
        })

        app.delete('/adoption-requests/pet/:id', async (req, res) => {
            const { id } = req.params
            const result = await adoptionCollection.deleteOne({ _id: new ObjectId(id) })
            res.json(result)
        })


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