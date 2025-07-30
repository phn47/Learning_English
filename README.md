# 🎓 Learning_English - Nền Tảng Học Tiếng Anh Thông Minh

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21.1-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/atlas)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5--turbo-purple.svg)](https://openai.com/)

## 📖 Tổng Quan

Learning_English là một nền tảng học tiếng Anh toàn diện được xây dựng bằng Node.js và Express, tích hợp công nghệ AI của OpenAI để cung cấp trải nghiệm học tập cá nhân hóa và tương tác. Ứng dụng được thiết kế để hỗ trợ người học Việt Nam từ cơ bản đến nâng cao.

## ✨ Tính Năng Chính

### 🎯 Học Tập Cá Nhân Hóa
- **Hành trình học tập**: Thiết kế lộ trình riêng biệt cho từng người học
- **Hệ thống Gates & Stages**: Chia nhỏ bài học thành các giai đoạn dễ tiếp thu
- **Theo dõi tiến độ**: Lưu trữ và hiển thị tiến độ học tập chi tiết

### 🤖 Tích Hợp AI
- **Chat với AI**: Trò chuyện thực tế với GPT-3.5-turbo
- **Phân tích bài viết**: AI đánh giá và sửa lỗi ngữ pháp, chính tả
- **Giao tiếp bằng giọng nói**: Speech-to-text và text-to-speech
- **Phân tích phát âm**: Sử dụng Whisper API để đánh giá phát âm

### 📚 Nội Dung Học Tập
- **Ngữ pháp**: Bài học và bài tập ngữ pháp từ cơ bản đến nâng cao
- **Từ vựng**: Flashcard và bài tập từ vựng theo chủ đề
- **Phát âm**: Luyện tập phát âm với công nghệ AI
- **Chính tả**: Bài tập nghe và chép chính tả
- **Câu chuyện**: Học qua các câu chuyện tương tác

### 🎮 Tương Tác & Gamification
- **Bài tập tương tác**: Nhiều loại bài tập khác nhau
- **Hệ thống điểm**: Theo dõi thành tích học tập
- **Lời nhắc học tập**: Email nhắc nhở tự động

## 🛠 Công Nghệ Sử Dụng

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database (MongoDB Atlas)
- **Mongoose**: ODM cho MongoDB
- **Passport.js**: Authentication
- **JWT**: JSON Web Tokens
- **bcrypt**: Password hashing

### AI & External APIs
- **OpenAI API**: GPT-3.5-turbo cho chat và phân tích
- **Whisper API**: Speech-to-text
- **Google APIs**: OAuth và các dịch vụ khác
- **Dialogflow**: Chatbot capabilities

### Frontend
- **EJS**: Template engine
- **Bootstrap**: CSS framework
- **jQuery**: JavaScript library
- **Web Speech API**: Speech recognition và synthesis

### Utilities
- **Nodemailer**: Email service
- **Multer**: File upload
- **Node-cron**: Scheduled tasks
- **Franc-min**: Language detection

## 📁 Cấu Trúc Dự Án

```
Learning_English/
├── app.js                          # Entry point
├── package.json                    # Dependencies
├── sample-data.js                  # Sample data generator
├── apps/
│   ├── controllers/               # Route controllers
│   │   ├── admin/                # Admin controllers
│   │   ├── chatcontroller.js     # AI chat
│   │   ├── communicatecontroller.js # Voice communication
│   │   ├── writingcontroller.js  # Writing analysis
│   │   └── ...                   # Other controllers
│   ├── models/                   # Data models
│   │   ├── user.js
│   │   ├── journey.js
│   │   ├── grammar.js
│   │   └── ...                   # Other models
│   ├── services/                 # Business logic
│   │   ├── userService.js
│   │   ├── grammarService.js
│   │   └── ...                   # Other services
│   ├── views/                    # EJS templates
│   │   ├── partials/            # Reusable components
│   │   ├── admin/               # Admin views
│   │   └── ...                   # Other views
│   ├── config/                   # Configuration
│   │   └── setting.json         # Database & API config
│   ├── database/                 # Database connection
│   └── util/                     # Utilities
├── public/                       # Static files
│   ├── static/                   # CSS, JS, images
│   └── admin/                    # Admin assets
└── node_modules/                 # Dependencies
```

## 🚀 Cài Đặt & Chạy

### Yêu Cầu Hệ Thống
- Node.js 18.x trở lên
- MongoDB Atlas account
- OpenAI API key

### Bước 1: Clone Repository
```bash
git clone <repository-url>
cd Learning_English
```

### Bước 2: Cài Đặt Dependencies
```bash
npm install
```

### Bước 3: Cấu Hình Environment
Tạo file `.env` trong thư mục gốc:
```env
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri
PORT=3000
```

### Bước 4: Cấu Hình Database
Cập nhật thông tin database trong `apps/config/setting.json`:
```json
{
  "mongodb": {
    "username": "your_username",
    "password": "your_password",
    "database": "studyenglish_db"
  }
}
```

### Bước 5: Khởi Tạo Dữ Liệu Mẫu
```bash
node sample-data.js
```

### Bước 6: Chạy Ứng Dụng
```bash
npm start
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

## 📊 Database Schema

### Collections Chính
- **users**: Thông tin người dùng
- **journeys**: Hành trình học tập
- **gates**: Các cổng/bài học
- **stages**: Giai đoạn học tập
- **grammars**: Nội dung ngữ pháp
- **pronunciations**: Nội dung phát âm
- **vocabularyexercises**: Bài tập từ vựng
- **grammarexercises**: Bài tập ngữ pháp
- **pronunciationexercises**: Bài tập phát âm
- **flashcards**: Thẻ ghi nhớ
- **userprogresses**: Tiến độ học tập
- **stories**: Câu chuyện học tập
- **dictationexercises**: Bài tập chính tả
- **reminders**: Lời nhắc học tập

## 🔐 Bảo Mật

- **Authentication**: Passport.js với Local Strategy
- **Password Hashing**: bcrypt
- **Session Management**: express-session
- **JWT**: JSON Web Tokens cho API
- **Input Validation**: Sanitization và validation
- **CORS**: Cross-Origin Resource Sharing

## 🎨 Giao Diện

- **Responsive Design**: Tương thích mọi thiết bị
- **Modern UI**: Bootstrap framework
- **Interactive Elements**: JavaScript tương tác
- **Accessibility**: Hỗ trợ người khuyết tật
- **Multi-language**: Hỗ trợ tiếng Việt và tiếng Anh

## 🤝 API Endpoints

### Authentication
- `POST /login` - Đăng nhập
- `POST /register` - Đăng ký
- `GET /logout` - Đăng xuất

### AI Features
- `POST /api/chat` - Chat với AI
- `POST /api/communicate` - Giao tiếp bằng giọng nói
- `POST /writing/api/analyze` - Phân tích bài viết
- `POST /pronunciation-exercise/analyze/:id/:index` - Phân tích phát âm

### Learning Content
- `GET /journey` - Hành trình học tập
- `GET /grammar` - Bài học ngữ pháp
- `GET /vocabulary-exercise` - Bài tập từ vựng
- `GET /pronunciation-exercise` - Bài tập phát âm
- `GET /flashcards` - Thẻ ghi nhớ

## 📈 Tính Năng Nâng Cao

### AI Integration
- **Natural Language Processing**: Xử lý ngôn ngữ tự nhiên
- **Speech Recognition**: Nhận diện giọng nói
- **Text-to-Speech**: Chuyển đổi văn bản thành giọng nói
- **Language Detection**: Tự động phát hiện ngôn ngữ

### Learning Analytics
- **Progress Tracking**: Theo dõi tiến độ chi tiết
- **Performance Analytics**: Phân tích hiệu suất học tập
- **Personalized Recommendations**: Gợi ý nội dung phù hợp

### Admin Panel
- **Content Management**: Quản lý nội dung học tập
- **User Management**: Quản lý người dùng
- **Analytics Dashboard**: Bảng điều khiển thống kê
- **System Monitoring**: Giám sát hệ thống

## 🧪 Testing

```bash
# Chạy tests (nếu có)
npm test

# Kiểm tra linting
npm run lint
```

## 📝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phát hành dưới giấy phép ISC. Xem file `LICENSE` để biết thêm chi tiết.

## 👥 Tác Giả

**Phạm Nam** - *Initial work* - [GitHub Profile]

## 🙏 Acknowledgments

- OpenAI cho việc cung cấp API GPT và Whisper
- MongoDB Atlas cho dịch vụ database
- Bootstrap cho framework CSS
- Cộng đồng Node.js và Express

## 📞 Liên Hệ

- **Email**: phamnam1449@gmail.com
- **Project Link**: [https://github.com/phn47/Learning_English](https://github.com/phn47/Learning_English)

---

⭐ Nếu dự án này hữu ích, hãy cho chúng tôi một ngôi sao!
