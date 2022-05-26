const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.alih4.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const partCollection = client.db('assignment-12').collection('parts')
        const reviewCollection = client.db('assignment-12').collection('reviews')
        const userInfoCollection = client.db('assignment-12').collection('userInfo')
        const userCollection = client.db('assignment-12').collection('users')
        const userOrderCollection = client.db('assignment-12').collection('userOrders')


        app.get('/part', async (req, res) => {
            const query = {}
            const cursor = partCollection.find(query)
            const parts = await cursor.toArray()
            res.send(parts)
        })

        app.get('/review', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })

        app.get('/part/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const purchase = await partCollection.findOne(query)
            res.send(purchase)
        })

        app.post('/review', async (req, res) => {
            const data = req.body
            const result = await reviewCollection.insertOne(data)
            res.send(result)
        })

        app.post('/part', async (req, res) => {
            const data = req.body
            const result = await partCollection.insertOne(data)
            res.send(result)
        })

        app.post('/userInfo', async (req, res) => {
            const data = req.body
            const result = await userInfoCollection.insertOne(data)
            res.send(result)
        })

        app.get('/user', async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query)
            const users = await cursor.toArray()
            res.send(users)
        })

        app.post('/user', async (req, res) => {
            const data = req.body
            const result = await userCollection.insertOne(data)
            res.send(result)
        })

        app.put('/user/:email', async (req, res) => {
            const email = req.params.email
            const user = req.body
            const filter = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options)
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send(result, token)
        })

        // apis for users orders
        app.get('/userOrder', async (req, res) => {
            const customer = req.query.customer
            const query = { customer: customer }
            const userOrders = await userOrderCollection.find(query).toArray()
            res.send(userOrders)
        })

        app.post('/userOrder', async (req, res) => {
            const userOrder = req.body
            const query = { customer: userOrder.customer }
            const exists = await userOrderCollection.findOne(query)
            if (exists) {
                return res.send({ success: false, userOrder: exists })
            }
            const result = await userOrderCollection.insertOne(userOrder)
            return res.send({ success: true, result })
        })



    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello from assignment 12 server')
})

app.listen(port, () => {
    console.log(`manufacturer app listening on port ${port}`);
})