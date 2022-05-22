const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello from assignment 12 server')
})

app.listen(port, () => {
    console.log(`manufacturer app listening on port ${port}`);
})