const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Book = require('../models/book')
const User = require('../models/User')

let token // Store JWT token

beforeEach(async () => {
  await Book.deleteMany({})
  await User.deleteMany({})

  const user = new User({
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123'
  })

  const savedUser = await user.save()

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id
  }

  token = jwt.sign(userForToken, process.env.SECRET)

  const bookObjects = helper.initialData.map(book => new Book({ ...book, creator: savedUser._id }))
  const promiseArray = bookObjects.map(book => book.save())
  await Promise.all(promiseArray)
})

test('books are returned as json', async () => {
  await api
    .get('/api/books')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all books are returned', async () => {
  const response = await api.get('/api/books')
  assert.strictEqual(response.body.length, helper.initialData.length)
})

test('a specific book is within the returned data', async () => {
  const response = await api.get('/api/books')
  const names = response.body.map(r => r.name)
  assert(names.includes('Browser can execute only JavaScript'))
})

test('a valid book can be added', async () => {
  const newBook = {
    name: 'async/await simplifies making async calls'
  }

  await api
    .post('/api/books')
    .set('Authorization', `Bearer ${token}`)
    .send(newBook)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const booksAtEnd = await helper.booksInDb()
  assert.strictEqual(booksAtEnd.length, helper.initialData.length + 1)

  const names = booksAtEnd.map(n => n.name)
  assert(names.includes('async/await simplifies making async calls'))
})

test('book without name is not added', async () => {
  const newBook = {}

  await api
    .post('/api/books')
    .set('Authorization', `Bearer ${token}`)
    .send(newBook)
    .expect(400)

  const booksAtEnd = await helper.booksInDb()
  assert.strictEqual(booksAtEnd.length, helper.initialData.length)
})

test('booksInDb function works', async () => {
  const books = await helper.booksInDb()
  assert(typeof books[0].name === 'string')
})

test('a specific book can be viewed', async () => {
  const booksAtFirst = await helper.booksInDb()
  const bookToView = booksAtFirst[0]

  const resultBook = await api
    .get(`/api/books/${bookToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBook.body.name, bookToView.name)
})

test('a specific book can be deleted', async () => {
  const booksAtFirst = await helper.booksInDb()
  const bookToDelete = booksAtFirst[0]

  await api
    .delete(`/api/books/${bookToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const booksAtEnd = await helper.booksInDb()
  const names = booksAtEnd.map(i => i.name)
  assert(!names.includes(bookToDelete.name))
  assert.strictEqual(booksAtEnd.length, helper.initialData.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})
