const express = require('express');
const router = express.Router();
const UserProgressService = require("./../../services/userService");
const userProgressService = new UserProgressService();

// Lấy tiến trình của 1 học sinh
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const progress = await userProgressService.getUserProgressByUserId(userId);
        res.json({ success: true, data: progress });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy tiến trình', error });
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

module.exports = router;
