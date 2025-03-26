var express = require("express");
var router = express.Router(); // Khởi tạo router

// Route hiển thị giao diện ChatGPT
router.get("/", function (req, res) {
    res.render("chat"); // Render file "chat.ejs" từ thư mục views
});

// Cấu hình OpenAI API
const OpenAI = require("openai"); // Đúng cú pháp cho OpenAI 4.x

let openai;
try {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_development', // API Key từ file .env hoặc key tạm thời
    });
} catch (error) {
    console.warn("Cảnh báo: Không thể khởi tạo OpenAI API:", error);
}

// Route API để gửi câu hỏi tới ChatGPT
router.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    if (!openai) {
        return res.status(503).json({ error: 'OpenAI service unavailable. Please check API key configuration.' });
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Hoặc gpt-4 nếu có quyền truy cập
            messages: [{ role: "user", content: message }],
        });

        const gptResponse = response.choices[0].message.content;
        res.json({ response: gptResponse });
    } catch (error) {
        console.error("OpenAI API error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error processing request' });
    }
});

module.exports = router; // Xuất router để sử dụng trong app.js