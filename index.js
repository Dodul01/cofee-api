const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());

const uri = process.env.URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db('cofeeDB');
    const cofeesCollction = database.collection('cofees');

    app.post('/cofees', async (req, res) => {
      const cofee = req.body;
      const result = await cofeesCollction.insertOne(cofee);
      res.send(result);
    })

    app.get('/cofees', async (req, res) => {
      const cursor = cofeesCollction.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.put('/cofees/:id', async (req, res) => {
      const id = req.params.id;
      const cofee = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };


      const updateCofee = {
        $set: {
          cofeeName: cofee.cofeeName,
          chefName: cofee.chefName,
          supplierName: cofee.supplierName,
          tasteName: cofee.tasteName,
          categoryName: cofee.categoryName,
          details: cofee.details,
          thumbnailUrl: cofee.thumbnailUrl
        }
      }
      const result = await cofeesCollction.updateOne(filter, updateCofee, options);
      res.send(result);
    })

    app.delete('/cofees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cofeesCollction.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {

    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})