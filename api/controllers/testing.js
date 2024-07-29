const router = require('express').Router()
const Book = require('../models/book')
const User = require('../models/User')

router.post('/reset', async (request, response) => {
  await Book.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router