const mongoose = require('mongoose');
const config = require('./../config/setting.json');

class DatabaseConnection {
    static url;
    static user;
    static pass;
    static cluster;
    static dbName;

    constructor() { }

    // Phương thức kết nối MongoDB Client (cách cũ)
    static getMongoClient() {
        this.user = config.mongodb.username;
        this.pass = encodeURIComponent(config.mongodb.password);
        this.cluster = config.mongodb.cluster;
        this.url = `mongodb+srv://${this.user}:${this.pass}@${this.cluster}/?retryWrites=true&w=majority`;
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(this.url);
        return client;
    }

    // Phương thức kết nối Mongoose (cách mới)
    static async connectToDatabase() {
        try {
            const username = config.mongodb.username;
            const password = encodeURIComponent(config.mongodb.password);
            const cluster = config.mongodb.cluster;
            const dbName = config.mongodb.database;

            const uri = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority`;

            await mongoose.connect(uri, {
                dbName: dbName
            });

            console.log('Kết nối MongoDB Atlas thành công!');

            // Xử lý các sự kiện kết nối
            mongoose.connection.on('error', (err) => {
                console.error('Lỗi kết nối MongoDB:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.log('MongoDB đã bị ngắt kết nối');
            });

            // Xử lý khi process kết thúc
            process.on('SIGINT', async () => {
                await mongoose.connection.close();
                console.log('Đóng kết nối MongoDB khi ứng dụng kết thúc');
                process.exit(0);
            });

            return mongoose.connection;
        } catch (error) {
            console.error('Không thể kết nối đến MongoDB Atlas:', error);
            throw error;
        }
    }
}

// Xuất cả class DatabaseConnection và mongoose
module.exports = {
    DatabaseConnection,
    mongoose,
    connectToDatabase: DatabaseConnection.connectToDatabase
};