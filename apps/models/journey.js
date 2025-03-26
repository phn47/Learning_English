const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const journeySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    gates: [{
        type: Schema.Types.ObjectId,
        ref: 'Gate'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Middleware cập nhật thời gian khi cập nhật document
journeySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Journey = mongoose.model('Journey', journeySchema);
module.exports = Journey;
