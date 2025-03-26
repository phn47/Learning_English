const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Định nghĩa Schema cho Blog
const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String
    }],
    imageUrl: {
        type: String,
        default: ''
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
blogSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Tạo model Blog từ schema
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
