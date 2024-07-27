const express = require('express')
const { default: mongoose } = require('mongoose')
const app = express()
const cors = require('cors')
require('dotenv').config()

// mongodb connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to mongodb'))
    .catch((error) => console.error('Error connecting to mongodb:', error))

// middlewares
app.use(cors())
app.use(express.json())

module.exports = app