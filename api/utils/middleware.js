const User = require('../models/User')
const Book = require('../models/book')
const logger = require('./logger')
const jwt = require('jsonwebtoken')

// logs the request info for each API call
const reqLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path: ', req.path)
  logger.info('Body: ', req.body)
  logger.info('---')
  next()
}

// error handler catches requests to unknown endpoints
const unknownEndPoint = (req, res) => {
  res.status(404).end()
}

// global error handler
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(404).send({ error: 'malforatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if ( error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return res.status(400).json({ error: 'expected username to be unique' })
  } else if ( error.name === 'JsonWebTokenError' ) {
    return res.status(400).json({ error: 'token missing or invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }

  next(error)
}

// middleware extracts the token sent from client
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    const token = authorization.substring(7)
    req.token = jwt.verify(token, process.env.SECRET) // decode the token got from req.body and assign it as 'req.token'

    if (!req.token.id) {
      return res.statusU(404).json({ error: 'token missing or invalid' })
    }

    next()
  } else next()
}

// middleware extracts the authorized user
const userExtractor = async (req, res, next) => {
  req.user = await User.findById(req.token.id)

  next()
}

// middleware extracts the authorized user's creations
const bookExtractor = async (req, res, next) => {
  req.book = await Book.findById(req.params.id)

  next()
}

module.exports = {
  errorHandler,
  unknownEndPoint,
  reqLogger,
  tokenExtractor,
  userExtractor,
  bookExtractor
}