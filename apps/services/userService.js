const { ObjectId } = require('mongodb');
var config = require("./../config/setting.json");
const { DatabaseConnection } = require('./../database/database');

class UsersService {
    users = require('./../models/user');

    client;
    usersDatabase;
    usersCollection;

    constructor() {
        this.client = DatabaseConnection.getMongoClient();
        this.usersDatabase = this.client.db(config.mongodb.database);
        this.usersCollection = this.usersDatabase.collection("users");
    }

    async getUserList(page = 1, limit = 3) {
        const skip = (page - 1) * limit;


        const cursor = await this.usersCollection
            .find({}, {})
            .skip(skip)
            .limit(limit);

        const users = await cursor.toArray();
        const totalUsers = await this.usersCollection.countDocuments();

        return {
            users,
            totalUsers,
        };
    }

    async getUser(id) {
        return await this.usersCollection.findOne({ _id: new ObjectId(id) });
    }
    async getUserByEmail(email) {
        return await this.usersCollection.findOne({ email });
    }
    async insertUser(user) {
        user.createdAt = new Date();
        return await this.usersCollection.insertOne(user);
    }

    async updateUser(user) {
        const { _id, ...updateFields } = user;

        const result = await this.usersCollection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: updateFields }
        );
        return result;
    }

    async deleteUser(id) {
        return await this.usersCollection.deleteOne({ "_id": new ObjectId(id) });
    }
}

module.exports = UsersService;
