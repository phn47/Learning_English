const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pronunciationExerciseSchema = new Schema({
    word: {
        type: String,
        required: true
    },
    audioUrl: {
        type: String,
        default: ''
    },
    correctPronunciation: {
        type: String,
        required: true
    },
    hints: [{
        type: String
    }],
    pronunciation: {
        type: Schema.Types.ObjectId,
        ref: 'Pronunciation',
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
pronunciationExerciseSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('PronunciationExercise', pronunciationExerciseSchema);
