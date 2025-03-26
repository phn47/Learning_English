const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pronunciationSchema = new Schema({
    word: {
        type: String,
        required: true
    },
    phonetic: {
        type: String,
        default: ''
    },
    audioUrl: {
        type: String,
        default: ''
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
pronunciationSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Pronunciation', pronunciationSchema);