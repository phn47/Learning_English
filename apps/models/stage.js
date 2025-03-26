const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema cho câu hỏi trong bài tập
const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['multiple-choice', 'fill-in-the-blank', 'translation'], // Các loại câu hỏi
        required: true
    },
    options: {
        type: [String],  // Các tùy chọn cho câu hỏi trắc nghiệm
        required: function () {
            return this.type === 'multiple-choice';  // Chỉ cần thiết khi loại là multiple-choice
        }
    },
    correctAnswer: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    }
}, { _id: false });

// Schema chính cho Exercise Stage
const stageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    gate: {
        type: Schema.Types.ObjectId,
        ref: 'Gate',  // Tham chiếu tới gate
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: ['grammar', 'pronunciation', 'vocabulary'],
        required: true
    },
    content: {
        type: Schema.Types.Mixed,
        default: {}
    },
    exercises: [{
        type: Schema.Types.ObjectId,
        refPath: 'exerciseType'
    }],
    exerciseType: {
        type: String,
        enum: ['GrammarExercise', 'PronunciationExercise', 'VocabularyExercise']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    questions: {
        type: [questionSchema],  // Danh sách câu hỏi
        required: true
    }
}, { timestamps: true });  // Tự động thêm createdAt và updatedAt

// Middleware cập nhật thời gian khi cập nhật document
stageSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Model Stage
const Stage = mongoose.model('Stage', stageSchema);
module.exports = Stage;
