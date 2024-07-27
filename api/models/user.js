const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true  // this ensures the uniqueness of the usename
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: String,

    // holds the list of books that user created
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],

    // holds the list of books that the user added to favorites
    favoriteBooks: [{
        book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
        favoriteDate: { type: Date, default: Date.now }
    }],
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
})

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        delete ret.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)

