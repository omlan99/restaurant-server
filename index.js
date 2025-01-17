const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');


// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.e6udf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const menuCollection = client.db('MenuDB').collection('Menus')
    const reviewCollection = client.db('MenuDB').collection('Reviews')
    const cartollection = client.db('MenuDB').collection('cartItem')

    app.get('/menu', async (req,res) => {
        const result = await menuCollection.find().toArray()
        res.send(result)
    })
    app.get('/reviews', async (req, res) => {
        const result = await reviewCollection.find().toArray();
        res.send(result)
    })

    //cart item
    app.get('/carts', async (req, res) =>{
      const email = req.query.email
      const query = {email : email}
      const result = await cartollection.find(query).toArray();
      res.send(result)

    })
    app.post('/carts', async (req,res) => {
      const cartItem = req.body
      const result = await cartollection.insertOne(cartItem);
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

  

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await newFunction();
  }

    async function newFunction() {
        await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Data is coming')
})

app.listen(port, () =>{
    console.log('app running on port :', port)
})