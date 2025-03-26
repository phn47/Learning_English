const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const grammarExerciseSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    options: [{
        type: String
    }],
    correctAnswer: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        default: ''
    },
    grammar: {
        type: Schema.Types.ObjectId,
        ref: 'Grammar',
        required: true
    },
    type: {
        type: String,
        enum: ['multiple-choice', 'fill-in-blank', 'rewrite'],
        default: 'multiple-choice'
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
grammarExerciseSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('GrammarExercise', grammarExerciseSchema);
