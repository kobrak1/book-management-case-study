const config = require('./utils/config')
const middleware = require('./utils/middleware')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const authRouter = require('./routes/authRoute')
const usersRouter = require('./controllers/users')
const booksRouter = require('./controllers/books')

// mongodb connection
mongoose.connect(config.MONGODB_URI)
    .then(() => console.log('Connected to mongodb'))
    .catch((error) => console.error('Error connecting to mongodb:', error))

// middlewares
app.use(cors())
app.use(express.json())
app.use(middleware.reqLogger)
app.use(middleware.tokenExtractor)

// routes
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/books', booksRouter)

// apply testing route if the NODE_ENV=test
if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)

module.exports = app