const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flashcardListSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cards: [{
    type: Schema.Types.ObjectId,
    ref: 'Flashcard'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware cập nhật thời gian khi cập nhật document
flashcardListSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FlashcardList', flashcardListSchema);
