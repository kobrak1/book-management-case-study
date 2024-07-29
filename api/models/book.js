// Schema design explanation:
// Book Schema: includes name, creator (user ID), and favoritedBy (array of user IDs)

const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

bookSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

const Book = mongoose.model("Book", bookSchema)
module.exports = Book
