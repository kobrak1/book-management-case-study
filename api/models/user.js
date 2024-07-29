// Schema design explanation:
// User Schema: includes email, password, username, and favoriteBooks (array of book IDs)

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // this ensures the uniqueness of the usename
        immutable: true,  // usernames cannot be changed post-registration
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true   // Ensure email addresses are unique
    },
    passwordHash: String,

    // holds the list of books that user created
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        unique: true  // ensures a user cannot favorite the same book more than once
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
        delete ret.passwordHash  // the passwordHash should not be revealed
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User