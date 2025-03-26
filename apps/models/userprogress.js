// models/UserProgress.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const completedExerciseSchema = new Schema({
    exerciseId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        enum: ['grammar', 'pronunciation', 'vocabulary'],
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

const userProgressSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    journey: {
        type: Schema.Types.ObjectId,
        ref: 'Journey',
        required: true
    },
    gate: {
        type: Schema.Types.ObjectId,
        ref: 'Gate'
    },
    stage: {
        type: Schema.Types.ObjectId,
        ref: 'Stage'
    },
    completedExercises: [completedExerciseSchema],
    currentStage: {
        type: Schema.Types.ObjectId,
        ref: 'Stage'
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
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
userProgressSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('UserProgress', userProgressSchema);
