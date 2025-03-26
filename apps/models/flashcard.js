const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flashcardSchema = new Schema({
  word: {
    type: String,
    required: true
  },
  meaning: {
    type: String,
    required: true
  },
  example: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  list: {
    type: Schema.Types.ObjectId,
    ref: 'FlashcardList',
    required: true
  },
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
flashcardSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Flashcard', flashcardSchema);
