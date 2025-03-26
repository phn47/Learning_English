const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gateSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    journey: {
        type: Schema.Types.ObjectId,
        ref: 'Journey',
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    stages: [{
        type: Schema.Types.ObjectId,
        ref: 'Stage'
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
gateSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Gate', gateSchema);
