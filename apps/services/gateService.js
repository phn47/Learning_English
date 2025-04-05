const { ObjectId } = require("mongodb");
const config = require("./../config/setting.json");

class GateService {
    databaseConnection = require('./../database/database');
    gates = require('./../models/gate');
    client;
    gatesDatabase;
    gatesCollection;

    constructor() {
        this.client = this.databaseConnection.getMongoClient();
        this.gatesDatabase = this.client.db(config.mongodb.database);
        this.gatesCollection = this.gatesDatabase.collection("gates");
    }
    async getGateList(page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const gates = await this.gatesCollection.aggregate([
            {
                $lookup: {
                    from: "journeys",
                    localField: "journey",
                    foreignField: "_id",
                    as: "journeyInfo"
                }
            },
            { $unwind: { path: "$journeyInfo", preserveNullAndEmptyArrays: true } },
            { $skip: skip },
            { $limit: limit }
        ]).toArray();

        const totalGates = await this.gatesCollection.countDocuments();

        return { gates, totalGates };
    }

    async getGateById(gateId) {
        return await this.gatesCollection.findOne({ _id: new ObjectId(gateId) });
    }

    async getGatesInJourney(journeyId) {
        return await this.gatesCollection.find({ journey: new ObjectId(journeyId) }).sort({ _id: 1 }).toArray();
    }

    async insertGate(gate) {
        gate.stages = [];
        gate.createdAt = new Date();
        return await this.gatesCollection.insertOne(gate);
    }

    async updateGate(gate) {
        const { _id, ...updateData } = gate;
        return await this.gatesCollection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: updateData }
        );
    }

    async deleteGate(id) {
        return await this.gatesCollection.deleteOne({ _id: new ObjectId(id) });
    }

    async deleteGatesByJourney(journeyId) {
        return await this.gatesCollection.deleteMany({ journey: new ObjectId(journeyId) });
    }

    async addStageToGate(gateId, stageId) {
        try {
            return await this.gatesCollection.updateOne(
                { _id: new ObjectId(gateId) },
                { $addToSet: { stages: new ObjectId(stageId) } }
            );
        } catch (error) {
            console.error("Error in addStageToGate:", error);
            throw error;
        }
    }
    // Phương thức lấy cổng cuối cùng theo journeyId
    async getLastGateByJourney(journeyId) {
        try {
            // Tìm cổng cuối cùng của journey với sortOrder giảm dần
            const lastGate = await this.gatesCollection.find({ journey: new ObjectId(journeyId) })
                .sort({ sortOrder: -1 })  // Sắp xếp theo sortOrder giảm dần
                .limit(1)  // Chỉ lấy 1 cổng duy nhất
                .toArray();

            return lastGate[0];  // Trả về cổng đầu tiên (vì chỉ có 1 cổng được lấy)
        } catch (error) {
            console.error("Error in getLastGateByJourney:", error);
            throw error;  // Ném lỗi để có thể xử lý ở nơi gọi
        }
    }


    async removeStageFromGate(gateId, stageId) {
        try {
            return await this.gatesCollection.updateOne(
                { _id: new ObjectId(gateId) },
                { $pull: { stages: new ObjectId(stageId) } }
            );
        } catch (error) {
            console.error("Error in removeStageFromGate:", error);
            throw error;
        }
    }
}

module.exports = GateService;
