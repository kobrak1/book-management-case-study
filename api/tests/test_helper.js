const Book = require('../models/book')
const User = require('../models/User')

const initialData = [
  {
    name: 'HTML is easy',
    creator: 'John Doe'
  },
  {
    name: 'Browser can execute only JavaScript',
    creator: 'Jack Brave'
  }
]

const nonExistingId = async () => {
  const book = new Book({ name: 'willremovethissoon' })
  await book.save()
  await book.deleteOne()

  return book._id.toString()
}

const booksInDb = async () => {
  const books = await Book.find({})
  const newObject = books.map(book => book.toJSON())
  return newObject
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON)
}

module.exports = {
  initialData,
  nonExistingId,
  booksInDb,
  usersInDb
}