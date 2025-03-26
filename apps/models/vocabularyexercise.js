const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vocabularyExerciseSchema = new Schema({
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
    options: [{
        type: String
    }],
    correctAnswer: {
        type: String,
        required: true
    },
    stage: {
        type: Schema.Types.ObjectId,
        ref: 'Stage',
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
vocabularyExerciseSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('VocabularyExercise', vocabularyExerciseSchema);
