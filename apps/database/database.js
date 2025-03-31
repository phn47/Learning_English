const { use } = require('../controllers');
var config = require("./../config/setting.json");
class DatabaseConnection {
    url;
    user;
    pass;
    constructor() {

    }
    static getMongoClient() {
        this.user = config.mongodb.username;
        this.pass = encodeURIComponent(config.mongodb.password);
        this.url = `mongodb+srv://${this.user}:${this.pass}@nam.n53g3.mongodb.net/?retryWrites=true&w=majority`;
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(this.url);
        return client;
    }

}
module.exports = DatabaseConnection;