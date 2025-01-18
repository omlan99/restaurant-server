const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


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

    const userCollection = client.db('MenuDB').collection('user')
    const menuCollection = client.db('MenuDB').collection('menus')
    const reviewCollection = client.db('MenuDB').collection('reviews')
    const cartCollection = client.db('MenuDB').collection('carts')

    app.post('/users', async(req,res) => {
      const  user = req.body;
      
      const query = {email : user.email}
      const existingUser = await userCollection.findOne(query);
      if(existingUser){
        return res.send({message : 'user already exist', inseertedId : null })
      }
      const result = await userCollection.insertOne(user)
      res.send(result)  
    })

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
      const result = await cartCollection.find(query).toArray();
      res.send(result)

    })
    app.post('/carts', async (req,res) => {
      const cartItem = req.body
      const result = await cartCollection.insertOne(cartItem);
      res.send(result)
    })

    app.delete('/delete/:id', async (req,res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
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