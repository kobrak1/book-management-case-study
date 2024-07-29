const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Book = require('../models/book')

beforeEach(async () => {
  await Book.deleteMany({})

  const bookObjects = helper.initialData
    .map(book => new Book(book))
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

  const contents = response.body.map((r) => r.content)

  assert(contents.includes('Browser can execute only JavaScript'))
})

test('a valid book can be added ', async () => {
  const newBook = {
    name: 'async/await simplifies making async calls',
    creator: 'Sam Altman',
  }

  await api
    .post('/api/books')
    .send(newBook)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const booksAtEnd = await helper.booksInDb()
  assert.strictEqual(booksAtEnd.length, helper.initialData.length + 1)

  const books = booksAtEnd.map((n) => n.content)
  assert(books.includes('async/await simplifies making async calls'))
})

// test to post a data
test('book without content is not added', async () => {
  const newBook = {
    creator: 'Sam Altman',
  }

  await api.post('/api/books').send(newBook).expect(400)

  const booksAtEnd = await helper.notesInDb()

  assert.strictEqual(booksAtEnd.length, helper.initialData.length)
})

test('booksInDb function works', async () => {
  const isFunction = await helper.booksInDb()
  assert(typeof isFunction[0].content === 'string')
})

// test to get a specific data
test('a specific book can be viewed', async () => {
  const booksAtFirst = await helper.booksInDb()
  const bookToView = booksAtFirst[0]

  const resultBook = await api
    .get(`/api/books/${bookToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBook.body, bookToView)
})

// test to delete a data
test('a specific data can be deleted', async () => {
  const booksAtFirst = await helper.booksInDb()
  const bookToDelete = booksAtFirst[0]

  await api
    .delete(`/api/books/${bookToDelete.id}`)
    .expect(204)

  const booksAtEnd = await helper.booksInDb()
  const names = booksAtEnd.map((i) => i.name)
  assert(!names.includes(bookToDelete.name))

  assert.strictEqual(booksAtEnd.length, helper.initialData.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})