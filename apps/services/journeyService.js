const { ObjectId } = require('mongodb');
const config = require("./../config/setting.json");

class JourneyService {
    databaseConnection = require('./../database/database');
    journeys = require('./../models/journey');

    client;
    journeysDatabase;
    journeysCollection;

    constructor() {
        this.client = this.databaseConnection.getMongoClient();
        this.journeysDatabase = this.client.db(config.mongodb.database);
        this.journeysCollection = this.journeysDatabase.collection("journeys");
        // this.journeysCollection = this.journeysDatabase.collection("journeys");
        this.gatesCollection = this.journeysDatabase.collection("gates"); // Thêm collection cho gates
        this.stagesCollection = this.journeysDatabase.collection("stages"); // Thêm collection cho stages
        this.usersCollection = this.journeysDatabase.collection("users");
    }
    async getAllJourneys() {
        try {
            const journeys = await this.journeysCollection.find().toArray();
            console.log("Dữ liệu journeys từ cơ sở dữ liệu:", journeys);
            return journeys.map(journey => ({
                _id: journey._id.toString(),
                title: journey.title || 'Hành trình không xác định'
            }));
        } catch (err) {
            console.error("Lỗi khi lấy journeys:", err);
            return [];
        }
    }

    async getAllGates() {
        try {
            const gates = await this.gatesCollection.find().toArray();
            return gates.map(gate => ({
                _id: gate._id.toString(),
                title: gate.title || 'Gate không xác định'
            }));
        } catch (err) {
            console.error("Lỗi khi lấy gates:", err);
            return [];
        }
    }
    async getUserById(userId) {
        try {
            const user = await this.usersCollection.findOne({ _id: new ObjectId(userId) });
            return user ? {
                _id: user._id.toString(),
                username: user.username || 'Người dùng không xác định'
            } : null;
        } catch (err) {
            console.error("Lỗi khi lấy thông tin người dùng:", err);
            return null;
        }
    }

    async getAllStages() {
        try {
            const stages = await this.stagesCollection.find().toArray();
            return stages.map(stage => ({
                _id: stage._id.toString(),
                title: stage.title || 'Stage không xác định'
            }));
        } catch (err) {
            console.error("Lỗi khi lấy stages:", err);
            return [];
        }
    }
    async getJourneyList(page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const cursor = await this.journeysCollection
            .find({})
            .skip(skip)
            .limit(limit);

        const journeys = await cursor.toArray();
        const totalJourneys = await this.journeysCollection.countDocuments();

        return {
            journeys,
            totalJourneys,
        };
    }
    async getAllJourneysWithDetails() {
        return await this.journeysCollection.aggregate([
            {
                $lookup: {
                    from: 'gates',
                    localField: '_id',
                    foreignField: 'journey',
                    as: 'gates'
                }
            },
            {
                $unwind: {
                    path: "$gates",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'stages',
                    localField: 'gates._id',
                    foreignField: 'gate',
                    as: 'gates.stages'
                }
            },
            {
                $group: {
                    _id: "$_id",
                    title: { $first: "$title" },
                    createdAt: { $first: "$createdAt" },
                    gates: { $push: "$gates" }
                }
            }
        ]).toArray();
    }

    async getJourneyWithDetails(journeyId) {
        try {
            return await this.journeysCollection.aggregate([
                { $match: { _id: new ObjectId(journeyId) } },
                {
                    $lookup: {
                        from: 'gates',
                        localField: 'gates',
                        foreignField: '_id',
                        as: 'gates'
                    }
                },
                {
                    $unwind: { path: "$gates", preserveNullAndEmptyArrays: true }
                },
                {
                    $lookup: {
                        from: 'stages',
                        localField: 'gates.stages',
                        foreignField: '_id',
                        as: 'gates.stages'
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        title: { $first: "$title" },
                        gates: { $push: "$gates" }
                    }
                }
            ]).toArray().then(result => result[0]);
        } catch (error) {
            console.error("Error fetching journey details:", error);
            throw error;
        }
    }

    async getJourney(id) {
        return await this.journeysCollection.findOne({ _id: new ObjectId(id) });
    }

    async insertJourney(journey) {
        journey.createdAt = new Date();
        journey.gates = [];
        return await this.journeysCollection.insertOne(journey);
    }

    async addGateToJourney(journeyId, gateId) {
        return await this.journeysCollection.updateOne(
            { _id: new ObjectId(journeyId) },
            { $addToSet: { gates: new ObjectId(gateId) } }
        );
    }

    async removeGateFromJourney(journeyId, gateId) {
        return await this.journeysCollection.updateOne(
            { _id: new ObjectId(journeyId) },
            { $pull: { gates: new ObjectId(gateId) } }
        );
    }

    async updateJourney(journey) {
        const { _id, ...updateData } = journey;
        return await this.journeysCollection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: updateData }
        );
    }

    async deleteJourney(id) {
        return await this.journeysCollection.deleteOne({ _id: new ObjectId(id) });
    }
}

module.exports = JourneyService;
