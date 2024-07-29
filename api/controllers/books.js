const booksRouter = require('express').Router()
const Book = require('../models/book')
const { userExtractor, bookExtractor } = require('../utils/middleware')

// Create a new book entry
booksRouter.post('/', userExtractor, async (req, res, next) => {
    const { name } = req.body
  
    try {
      const book = new Book({
        name,
        creator: req.user._id
      })
  
      const savedBook = await book.save()
      res.status(201).json(savedBook)
    } catch (error) {
      next(error)
    }
  })
  
  // Get the list of all books with creator's username
  booksRouter.get('/', async (req, res, next) => {
    try {
      const books = await Book.find({}).populate('creator', 'username')
      res.json(books)
    } catch (error) {
      next(error)
    }
  })
  
  // Favorite a book
  booksRouter.post('/:id/favorite', userExtractor, bookExtractor, async (req, res, next) => {
    try {
      const user = req.user
      const book = req.book
  
      if (user._id.equals(book.creator)) {
        return res.status(400).json({ error: 'Users cannot favorite their own books' })
      }
  
      if (user.favoriteBooks.includes(book._id)) {
        return res.status(400).json({ error: 'Users cannot favorite the same book more than once' })
      }
  
      if (user.favoriteBooks.length >= 10) {
        return res.status(400).json({ error: 'Users can favorite a maximum of 10 books' })
      }
  
      user.favoriteBooks.push(book._id)
      book.favoritedBy.push(user._id)
  
      await user.save()
      await book.save()
  
      res.status(200).json({ message: 'Book favorited successfully' })
    } catch (error) {
      next(error)
    }
  })
  
  // Get the list of favorite books for the authenticated user
  booksRouter.get('/favorites', userExtractor, async (req, res, next) => {
    try {
      const user = req.user
  
      const favoriteBooks = await Book.find({ _id: { $in: user.favoriteBooks } }).populate('creator', 'username')
  
      res.json(favoriteBooks)
    } catch (error) {
      next(error)
    }
  })
  
  module.exports = booksRouter