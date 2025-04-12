const express = require('express');
const router = express.Router();
const UserProgressService = require("./../../services/userprogressService");
const userProgressService = new UserProgressService();
const JourneyService = require('./../../services/journeyService');  // Nếu có service cho journey
const journeyService = new JourneyService();


// Route để render trang quản lý tiến trình người dùng
router.get('/admin/userprogress', (req, res) => {
    res.render('admin/userProgress');
});




// router.get('/all', async (req, res) => {
//     try {
//         console.log("Đang lấy tất cả tiến trình người dùng...");
//         const progressList = await userProgressService.getAllUserProgress();
//         console.log("Danh sách tiến trình thô:", progressList);

//         console.log("Lấy tất cả journeys...");
//         const allJourneys = await journeyService.getAllJourneys();
//         console.log("Journeys tìm thấy:", allJourneys);

//         console.log("Lấy tất cả gates...");
//         const allGates = await journeyService.getAllGates();
//         console.log("Gates tìm thấy:", allGates);

//         console.log("Lấy tất cả stages...");
//         const allStages = await journeyService.getAllStages();
//         console.log("Stages tìm thấy:", allStages);

//         const journeyMap = new Map(allJourneys.map(journey => [journey._id, journey.title]));
//         console.log("JourneyMap được tạo:", [...journeyMap.entries()]);

//         const enrichedProgressList = await Promise.all(progressList.map(async progress => {
//             const userId = progress.user?.toString();
//             const user = await journeyService.getUserById(userId);
//             const username = user ? user.username : 'Người dùng không xác định';

//             const journeyId = progress.journey?.toString();
//             if (!journeyId) {
//                 console.log(`Không tìm thấy journey trong tiến trình của user ${userId}`);
//             } else {
//                 console.log(`Kiểm tra journeyId: ${journeyId} trong journeyMap:`, journeyMap.has(journeyId));
//             }
//             const journeyName = journeyId && journeyMap.has(journeyId) ? journeyMap.get(journeyId) : 'Hành trình không xác định';

//             const gateIds = (progress.unlockedGates || []).map(gate => gate.toString());
//             const gateMap = new Map(allGates.map(gate => [gate._id, gate.title]));
//             const unlockedGatesNames = gateIds.map(gateId => gateMap.get(gateId) || 'Gate không xác định');

//             const stageIds = (progress.unlockedStages || []).map(stage => stage.toString());
//             const stageMap = new Map(allStages.map(stage => [stage._id, stage.title]));
//             const unlockedStagesNames = stageIds.map(stageId => stageMap.get(stageId) || 'Stage không xác định');

//             return {
//                 ...progress,
//                 username,
//                 journeyName,
//                 unlockedGatesNames,
//                 unlockedStagesNames
//             };
//         }));

//         console.log("Dữ liệu tiến trình đã được lấy và bổ sung:", enrichedProgressList);
//         res.json({ success: true, data: enrichedProgressList });
//     } catch (error) {
//         console.error("Lỗi khi lấy tất cả tiến trình:", error);
//         res.status(500).json({ success: false, message: 'Lỗi khi lấy tất cả tiến trình', error: error.message });
//     }
// });



router.get('/all', async (req, res) => {
    try {
        console.log("Đang lấy tất cả tiến trình người dùng...");
        const progressList = await userProgressService.getAllUserProgress();
        console.log("Danh sách tiến trình thô:", progressList);

        console.log("Lấy tất cả journeys...");
        const allJourneys = await journeyService.getAllJourneys();
        console.log("Journeys tìm thấy:", allJourneys);

        console.log("Lấy tất cả gates...");
        const allGates = await journeyService.getAllGates();
        console.log("Gates tìm thấy:", allGates);

        console.log("Lấy tất cả stages...");
        const allStages = await journeyService.getAllStages();
        console.log("Stages tìm thấy:", allStages);

        const journeyMap = new Map(allJourneys.map(journey => [journey._id, journey.title]));
        console.log("JourneyMap được tạo:", [...journeyMap.entries()]);

        const gateMap = new Map(allGates.map(gate => [gate._id, gate.title]));
        const stageMap = new Map(allStages.map(stage => [stage._id, stage.title]));

        const enrichedProgressList = await Promise.all(progressList.map(async progress => {
            const userId = progress.user?.toString();
            const user = await journeyService.getUserById(userId);
            const username = user ? user.username : 'Người dùng không xác định';

            const journeyId = progress.journey?.toString();
            if (!journeyId) {
                console.log(`Không tìm thấy journey trong tiến trình của user ${userId}`);
            } else {
                console.log(`Kiểm tra journeyId: ${journeyId} trong journeyMap:`, journeyMap.has(journeyId));
            }
            const journeyName = journeyId && journeyMap.has(journeyId) ? journeyMap.get(journeyId) : 'Hành trình không xác định';

            const gateIds = (progress.unlockedGates || []).map(gate => gate.toString());
            const unlockedGatesNames = gateIds.map(gateId => gateMap.get(gateId) || 'Gate không xác định');

            const stageIds = (progress.unlockedStages || []).map(stage => stage.toString());
            const unlockedStagesNames = stageIds.map(stageId => stageMap.get(stageId) || 'Stage không xác định');

            return {
                ...progress,
                username,
                journeyName,
                unlockedGatesNames,
                unlockedStagesNames
            };
        }));

        console.log("Dữ liệu tiến trình đã được lấy và bổ sung:", enrichedProgressList);
        res.json({ success: true, data: enrichedProgressList });
    } catch (error) {
        console.error("Lỗi khi lấy tất cả tiến trình:", error);
        res.status(500).json({ success: false, message: 'Lỗi khi lấy tất cả tiến trình', error: error.message });
    }
});

// Bảng xếp hạng
router.get('/leaderboard/top/:limit?', async (req, res) => {
    try {
        const limit = parseInt(req.params.limit) || 10;
        const leaderboard = await userProgressService.getLeaderboard(limit);
        res.json({ success: true, data: leaderboard });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy bảng xếp hạng', error });
    }
});

// Route để lấy tất cả các journey (hành trình)
router.get('/journeys', async (req, res) => {
    try {
        const journeys = await journeyService.getAllJourneys();  // Dịch vụ để lấy tất cả journey
        res.json({ success: true, data: journeys });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy các hành trình', error });
    }
});

// Route để lấy thông tin một journey cụ thể, bao gồm các gates và stages
router.get('/journey/:journeyId', async (req, res) => {
    try {
        const { journeyId } = req.params;
        const journey = await journeyService.getJourneyById(journeyId);  // Dịch vụ để lấy journey theo ID
        res.json({ success: true, data: journey });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy hành trình', error });
    }
});

// Route để lấy thông tin một gate cụ thể
router.get('/gate/:gateId', async (req, res) => {
    try {
        const { gateId } = req.params;
        const gate = await journeyService.getGateById(gateId);  // Dịch vụ để lấy gate theo ID
        res.json({ success: true, data: gate });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy gate', error });
    }
});

// Route để lấy tất cả các stages trong một gate
router.get('/gate/:gateId/stages', async (req, res) => {
    try {
        const { gateId } = req.params;
        const stages = await journeyService.getStagesByGateId(gateId);  // Dịch vụ để lấy stages theo gateId
        res.json({ success: true, data: stages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy stages trong gate', error });
    }
});

// Route để lấy tiến trình của một người dùng trong một journey cụ thể
router.get('/:userId/journey/:journeyId', async (req, res) => {
    try {
        const { userId, journeyId } = req.params;
        const progress = await userProgressService.getUserProgressInJourney(userId, journeyId);
        res.json({ success: true, data: progress });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy tiến trình của người dùng trong hành trình', error });
    }
});

module.exports = router;
