const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const grammarSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        default: ''
    },
    examples: [{
        type: String
    }],
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
grammarSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Grammar', grammarSchema);
