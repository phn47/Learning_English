const bcrypt = require('bcrypt');
const { mongoose, connectToDatabase } = require('./apps/database/database');

// Import models
const User = require('./apps/models/user');
const Journey = require('./apps/models/journey');
const Gate = require('./apps/models/gate');
const Stage = require('./apps/models/stage');
const Grammar = require('./apps/models/grammar');
const GrammarExercise = require('./apps/models/grammarexercise');
const Pronunciation = require('./apps/models/pronunciation');
const PronunciationExercise = require('./apps/models/pronunciationexercise');
const VocabularyExercise = require('./apps/models/vocabularyexercise');
const Blog = require('./apps/models/blog');
const Flashcard = require('./apps/models/flashcard');
const FlashcardList = require('./apps/models/flashcard_list');
const UserProgress = require('./apps/models/userprogress');

// Tạo dữ liệu mẫu
const createSampleData = async () => {
    try {
        // Xóa dữ liệu hiện tại
        console.log('Đang xóa dữ liệu cũ...');

        const db = mongoose.connection.db;

        // Lấy danh sách tất cả các collections
        const collections = await db.listCollections().toArray();

        // Xóa từng collection
        for (const collection of collections) {
            await db.collection(collection.name).deleteMany({});
            console.log(`Đã xóa dữ liệu từ collection: ${collection.name}`);
        }

        console.log('Đã xóa dữ liệu cũ thành công');

        // Các ObjectIds tham chiếu
        const refs = {
            users: {},
            journeys: {},
            gates: {},
            stages: {},
            grammars: {},
            pronunciations: {},
            flashcardLists: {}
        };

        // 1. Tạo Users
        console.log('Đang tạo người dùng...');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        // Tạo users
        const users = await db.collection('users').insertMany([
            {
                username: 'admin',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin',
                active: true
            },
            {
                username: 'teacher_nguyen',
                email: 'teacher1@example.com',
                password: hashedPassword,
                role: 'teacher',
                active: true
            },
            {
                username: 'teacher_tran',
                email: 'teacher2@example.com',
                password: hashedPassword,
                role: 'teacher',
                active: true
            },
            {
                username: 'ngoc_anh',
                email: 'student1@example.com',
                password: hashedPassword,
                role: 'user',
                active: true
            },
            {
                username: 'thanh_binh',
                email: 'student2@example.com',
                password: hashedPassword,
                role: 'user',
                active: true
            },
            {
                username: 'minh_duc',
                email: 'student3@example.com',
                password: hashedPassword,
                role: 'user',
                active: true
            },
            {
                username: 'thu_ha',
                email: 'student4@example.com',
                password: hashedPassword,
                role: 'user',
                active: true
            },
            {
                username: 'van_hoang',
                email: 'student5@example.com',
                password: hashedPassword,
                role: 'user',
                active: true
            }
        ]);

        // Lưu trữ tham chiếu
        Object.entries(users.insertedIds).forEach(([index, id]) => {
            refs.users[`user${index}`] = id;
        });

        console.log(`Đã tạo ${users.insertedCount} người dùng`);

        // 2. Tạo Flashcard Lists
        console.log('Đang tạo danh sách flashcard...');

        const flashcardLists = await db.collection('flashcardlists').insertMany([
            {
                name: 'Từ vựng cơ bản hàng ngày',
                description: 'Các từ vựng tiếng Anh thông dụng sử dụng trong cuộc sống hàng ngày',
                createdAt: new Date()
            },
            {
                name: 'Từ vựng công nghệ thông tin',
                description: 'Từ vựng chuyên ngành trong lĩnh vực công nghệ thông tin và máy tính',
                createdAt: new Date()
            },
            {
                name: 'Từ vựng du lịch và khách sạn',
                description: 'Từ vựng cần thiết khi đi du lịch, đặt phòng khách sạn và tham quan',
                createdAt: new Date()
            },
            {
                name: 'Từ vựng thức ăn và nhà hàng',
                description: 'Từ vựng về món ăn, đồ uống và cách gọi món trong nhà hàng',
                createdAt: new Date()
            },
            {
                name: 'Từ vựng kinh doanh',
                description: 'Từ vựng thương mại, quản lý và giao tiếp trong môi trường kinh doanh',
                createdAt: new Date()
            },
            {
                name: 'Từ vựng y tế và sức khỏe',
                description: 'Từ vựng liên quan đến y tế, bệnh viện và chăm sóc sức khỏe',
                createdAt: new Date()
            },
            {
                name: 'Từ vựng IELTS thông dụng',
                description: 'Những từ vựng thường xuất hiện trong bài thi IELTS',
                createdAt: new Date()
            },
            {
                name: 'Từ vựng TOEIC cần biết',
                description: 'Từ vựng quan trọng cho kỳ thi TOEIC',
                createdAt: new Date()
            }
        ]);

        // Lưu trữ tham chiếu
        Object.entries(flashcardLists.insertedIds).forEach(([index, id]) => {
            refs.flashcardLists[`list${index}`] = id;
        });

        console.log(`Đã tạo ${flashcardLists.insertedCount} danh sách flashcard`);

        // 3. Tạo Flashcards
        console.log('Đang tạo flashcards...');

        const flashcardsData = [
            // Từ vựng cơ bản hàng ngày (list0)
            {
                word: 'hello',
                meaning: 'xin chào',
                pos: 'exclamation',
                pronunciation: '/həˈləʊ/',
                exampleSentence: 'Hello, how are you today?',
                image: 'https://images.unsplash.com/photo-1530983822321-fcac2d3c7568',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list0,
                createdAt: new Date()
            },
            {
                word: 'goodbye',
                meaning: 'tạm biệt',
                pos: 'exclamation',
                pronunciation: '/ˌɡʊdˈbaɪ/',
                exampleSentence: 'Goodbye, see you tomorrow!',
                image: 'https://images.unsplash.com/photo-1537815749002-de6a533c64db',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list0,
                createdAt: new Date()
            },
            {
                word: 'friend',
                meaning: 'bạn bè',
                pos: 'noun',
                pronunciation: '/frend/',
                exampleSentence: 'She is my best friend.',
                image: 'https://images.unsplash.com/photo-1536549880819-4a4b9381b3b7',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list0,
                createdAt: new Date()
            },
            {
                word: 'family',
                meaning: 'gia đình',
                pos: 'noun',
                pronunciation: '/ˈfæməli/',
                exampleSentence: 'I have a large family with many cousins.',
                image: 'https://images.unsplash.com/photo-1509506489701-dfe23b067808',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list0,
                createdAt: new Date()
            },
            {
                word: 'weather',
                meaning: 'thời tiết',
                pos: 'noun',
                pronunciation: '/ˈweðə(r)/',
                exampleSentence: 'The weather is sunny today.',
                image: 'https://images.unsplash.com/photo-1530743373890-f3c506b0b5b1',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list0,
                createdAt: new Date()
            },

            // Từ vựng công nghệ thông tin (list1)
            {
                word: 'software',
                meaning: 'phần mềm',
                pos: 'noun',
                pronunciation: '/ˈsɒftweə(r)/',
                exampleSentence: 'The company develops software for businesses.',
                image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list1,
                createdAt: new Date()
            },
            {
                word: 'hardware',
                meaning: 'phần cứng',
                pos: 'noun',
                pronunciation: '/ˈhɑːdweə(r)/',
                exampleSentence: 'The hardware consists of computer components.',
                image: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list1,
                createdAt: new Date()
            },
            {
                word: 'algorithm',
                meaning: 'thuật toán',
                pos: 'noun',
                pronunciation: '/ˈælɡərɪðəm/',
                exampleSentence: 'The search algorithm determines the results you see.',
                image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list1,
                createdAt: new Date()
            },
            {
                word: 'database',
                meaning: 'cơ sở dữ liệu',
                pos: 'noun',
                pronunciation: '/ˈdeɪtəbeɪs/',
                exampleSentence: 'The company stores customer information in a database.',
                image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list1,
                createdAt: new Date()
            },
            {
                word: 'programming',
                meaning: 'lập trình',
                pos: 'noun',
                pronunciation: '/ˈprəʊɡræmɪŋ/',
                exampleSentence: 'Programming is an essential skill for developers.',
                image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list1,
                createdAt: new Date()
            },

            // Từ vựng du lịch và khách sạn (list2)
            {
                word: 'passport',
                meaning: 'hộ chiếu',
                pos: 'noun',
                pronunciation: '/ˈpɑːspɔːt/',
                exampleSentence: 'Don\'t forget to bring your passport.',
                image: 'https://images.unsplash.com/photo-1554224311-beee415c201e',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list2,
                createdAt: new Date()
            },
            {
                word: 'luggage',
                meaning: 'hành lý',
                pos: 'noun',
                pronunciation: '/ˈlʌɡɪdʒ/',
                exampleSentence: 'We need to check in our luggage.',
                image: 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list2,
                createdAt: new Date()
            },
            {
                word: 'reservation',
                meaning: 'đặt chỗ, đặt phòng',
                pos: 'noun',
                pronunciation: '/ˌrezəˈveɪʃn/',
                exampleSentence: 'I made a hotel reservation for two nights.',
                image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list2,
                createdAt: new Date()
            },
            {
                word: 'sightseeing',
                meaning: 'tham quan, du lịch',
                pos: 'noun',
                pronunciation: '/ˈsaɪtsiːɪŋ/',
                exampleSentence: 'We spent the day sightseeing in Paris.',
                image: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list2,
                createdAt: new Date()
            },
            {
                word: 'accommodation',
                meaning: 'chỗ ở, nơi lưu trú',
                pos: 'noun',
                pronunciation: '/əˌkɒməˈdeɪʃn/',
                exampleSentence: 'The accommodation includes breakfast each morning.',
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list2,
                createdAt: new Date()
            },

            // Từ vựng thức ăn và nhà hàng (list3)
            {
                word: 'appetizer',
                meaning: 'món khai vị',
                pos: 'noun',
                pronunciation: '/ˈæpɪtaɪzə(r)/',
                exampleSentence: 'We ordered some appetizers before the main course.',
                image: 'https://images.unsplash.com/photo-1541795795328-f073b763494e',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list3,
                createdAt: new Date()
            },
            {
                word: 'dessert',
                meaning: 'món tráng miệng',
                pos: 'noun',
                pronunciation: '/dɪˈzɜːt/',
                exampleSentence: 'Would you like some dessert after dinner?',
                image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list3,
                createdAt: new Date()
            },
            {
                word: 'menu',
                meaning: 'thực đơn',
                pos: 'noun',
                pronunciation: '/ˈmenjuː/',
                exampleSentence: 'The waiter handed us the menu.',
                image: 'https://images.unsplash.com/photo-1529417305485-480f579e7578',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list3,
                createdAt: new Date()
            },

            // Từ vựng IELTS thông dụng (list6)
            {
                word: 'perspective',
                meaning: 'quan điểm, góc nhìn',
                pos: 'noun',
                pronunciation: '/pəˈspektɪv/',
                exampleSentence: 'From my perspective, this policy is beneficial.',
                image: 'https://images.unsplash.com/photo-1545989253-02cc26577f88',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list6,
                createdAt: new Date()
            },
            {
                word: 'controversial',
                meaning: 'gây tranh cãi',
                pos: 'adjective',
                pronunciation: '/ˌkɒntrəˈvɜːʃl/',
                exampleSentence: 'The new law is highly controversial.',
                image: 'https://images.unsplash.com/photo-1568744281068-74ba76a302bc',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list6,
                createdAt: new Date()
            },
            {
                word: 'substantial',
                meaning: 'đáng kể, quan trọng',
                pos: 'adjective',
                pronunciation: '/səbˈstænʃl/',
                exampleSentence: 'There is substantial evidence to support this theory.',
                image: 'https://images.unsplash.com/photo-1508345228704-935cc84bf5e2',
                audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
                flashcardList: refs.flashcardLists.list6,
                createdAt: new Date()
            }
        ];

        const flashcards = await db.collection('flashcards').insertMany(flashcardsData);

        console.log(`Đã tạo ${flashcards.insertedCount} flashcards`);

        // 4. Tạo Journeys
        console.log('Đang tạo hành trình học tập...');

        const journeysData = [
            {
                title: 'Tiếng Anh Cơ Bản',
                description: 'Khóa học dành cho người mới bắt đầu, giúp xây dựng nền tảng tiếng Anh vững chắc với từ vựng và ngữ pháp cơ bản.',
                gates: [],
                isLocked: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Tiếng Anh Giao Tiếp',
                description: 'Tập trung vào kỹ năng giao tiếp tiếng Anh hàng ngày, giúp bạn tự tin nói chuyện với người bản xứ trong các tình huống thông thường.',
                gates: [],
                isLocked: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Tiếng Anh Trung Cấp',
                description: 'Nâng cao kỹ năng tiếng Anh với các chủ đề phức tạp hơn và cấu trúc ngữ pháp nâng cao, dành cho người đã có nền tảng cơ bản.',
                gates: [],
                isLocked: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Tiếng Anh Thương Mại',
                description: 'Khóa học tiếng Anh chuyên ngành kinh doanh, giúp bạn giao tiếp hiệu quả trong môi trường công sở và các tình huống kinh doanh.',
                gates: [],
                isLocked: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Luyện Thi IELTS',
                description: 'Khóa học chuẩn bị cho kỳ thi IELTS với các chiến lược và kỹ thuật làm bài thi, giúp bạn đạt điểm cao trong cả 4 kỹ năng.',
                gates: [],
                isLocked: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Tiếng Anh Nâng Cao',
                description: 'Hoàn thiện kỹ năng tiếng Anh với các chủ đề chuyên sâu, giúp bạn giao tiếp như người bản xứ với từ vựng phong phú và ngữ pháp chính xác.',
                gates: [],
                isLocked: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        const journeys = await db.collection('journeys').insertMany(journeysData);

        // Lưu trữ tham chiếu
        Object.entries(journeys.insertedIds).forEach(([index, id]) => {
            refs.journeys[`journey${index}`] = id;
        });

        console.log(`Đã tạo ${journeys.insertedCount} hành trình học tập`);

        // 5. Tạo Gates
        console.log('Đang tạo cổng học tập...');

        const gatesData = [
            // Gates cho Tiếng Anh Cơ Bản (journey0)
            {
                title: 'Làm quen với tiếng Anh',
                description: 'Bước đầu làm quen với ngôn ngữ tiếng Anh qua bảng chữ cái, số đếm và các câu chào hỏi đơn giản.',
                stages: [],
                journey: refs.journeys.journey0,
                sortOrder: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Giao tiếp cơ bản',
                description: 'Học cách giao tiếp trong các tình huống hàng ngày như chào hỏi, giới thiệu bản thân, và hỏi đường.',
                stages: [],
                journey: refs.journeys.journey0,
                sortOrder: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Ngữ pháp cơ bản',
                description: 'Nắm vững các cấu trúc ngữ pháp cơ bản như thì hiện tại đơn, hiện tại tiếp diễn và các động từ thông dụng.',
                stages: [],
                journey: refs.journeys.journey0,
                sortOrder: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            // Gates cho Tiếng Anh Giao Tiếp (journey1)
            {
                title: 'Giao tiếp hàng ngày',
                description: 'Cách giao tiếp trong các tình huống thường ngày như mua sắm, đặt bàn nhà hàng, và hỏi đường.',
                stages: [],
                journey: refs.journeys.journey1,
                sortOrder: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Du lịch và khách sạn',
                description: 'Học cách đặt phòng khách sạn, mua vé máy bay, và giao tiếp khi đi du lịch nước ngoài.',
                stages: [],
                journey: refs.journeys.journey1,
                sortOrder: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Xã hội và giải trí',
                description: 'Từ vựng và cách giao tiếp về các chủ đề xã hội, giải trí, thể thao và sở thích cá nhân.',
                stages: [],
                journey: refs.journeys.journey1,
                sortOrder: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            // Gates cho Tiếng Anh Trung Cấp (journey2)
            {
                title: 'Ngữ pháp trung cấp',
                description: 'Học về các thì quá khứ, tương lai, câu điều kiện và các cấu trúc phức tạp hơn.',
                stages: [],
                journey: refs.journeys.journey2,
                sortOrder: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Từ vựng mở rộng',
                description: 'Mở rộng vốn từ vựng với các từ ngữ học thuật và chuyên ngành, cùng các thành ngữ thông dụng.',
                stages: [],
                journey: refs.journeys.journey2,
                sortOrder: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },

            // Gates cho Luyện Thi IELTS (journey4)
            {
                title: 'IELTS Listening',
                description: 'Chiến lược và kỹ thuật làm bài thi IELTS Listening, từ cách nghe lấy thông tin đến trả lời các dạng câu hỏi.',
                stages: [],
                journey: refs.journeys.journey4,
                sortOrder: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'IELTS Reading',
                description: 'Phương pháp đọc hiểu và trả lời các dạng câu hỏi trong bài thi IELTS Reading.',
                stages: [],
                journey: refs.journeys.journey4,
                sortOrder: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'IELTS Writing',
                description: 'Hướng dẫn viết Task 1 và Task 2 trong bài thi IELTS Writing, cùng các mẫu câu và từ vựng học thuật.',
                stages: [],
                journey: refs.journeys.journey4,
                sortOrder: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'IELTS Speaking',
                description: 'Luyện tập các phần thi IELTS Speaking, từ cách trả lời câu hỏi đến phát triển ý tưởng và phát âm chuẩn.',
                stages: [],
                journey: refs.journeys.journey4,
                sortOrder: 4,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        const gates = await db.collection('gates').insertMany(gatesData);

        // Lưu trữ tham chiếu
        Object.entries(gates.insertedIds).forEach(([index, id]) => {
            refs.gates[`gate${index}`] = id;
        });

        console.log(`Đã tạo ${gates.insertedCount} cổng học tập`);

        // Cập nhật journeys với gates
        await db.collection('journeys').updateOne(
            { _id: refs.journeys.journey0 },
            { $set: { gates: [refs.gates.gate0, refs.gates.gate1, refs.gates.gate2] } }
        );

        await db.collection('journeys').updateOne(
            { _id: refs.journeys.journey1 },
            { $set: { gates: [refs.gates.gate3, refs.gates.gate4, refs.gates.gate5] } }
        );

        await db.collection('journeys').updateOne(
            { _id: refs.journeys.journey2 },
            { $set: { gates: [refs.gates.gate6, refs.gates.gate7] } }
        );

        await db.collection('journeys').updateOne(
            { _id: refs.journeys.journey4 },
            { $set: { gates: [refs.gates.gate8, refs.gates.gate9, refs.gates.gate10, refs.gates.gate11] } }
        );

        // 6. Tạo Pronunciations
        console.log('Đang tạo bài học phát âm...');

        const pronunciationsData = [
            {
                description: 'Phát âm nguyên âm /æ/',
                content: `<p>Nguyên âm /æ/ được phát âm bằng cách mở rộng miệng, hạ lưỡi và kéo môi sang hai bên. Đây là âm thường gặp trong các từ như "cat", "map", "apple".</p>
                <p>Để phát âm đúng:</p>
                <ol>
                    <li>Mở miệng rộng hơn so với âm /e/</li>
                    <li>Đặt lưỡi thấp và phẳng trong miệng</li>
                    <li>Kéo môi sang hai bên như khi bạn cười</li>
                </ol>
                <p>Hãy thực hành với các từ sau: cat, map, hat, black, match</p>`,
                createdAt: new Date(),
                images: ['https://pronuncian.com/images/SoundImages/Features/a-as-in-at.png']
            },
            {
                description: 'Phát âm nguyên âm /ə/ (schwa)',
                content: `<p>Nguyên âm /ə/ hay còn gọi là "schwa" là âm trung tâm thường xuất hiện trong các âm tiết không nhấn. Đây là âm thông dụng nhất trong tiếng Anh.</p>
                <p>Để phát âm đúng:</p>
                <ol>
                    <li>Miệng mở vừa phải</li>
                    <li>Lưỡi ở vị trí trung lập trong miệng</li>
                    <li>Phát âm ngắn và nhẹ</li>
                </ol>
                <p>Âm này xuất hiện trong âm tiết không nhấn của các từ như: about, banana, computer</p>`,
                createdAt: new Date(),
                images: ['https://pronuncian.com/images/SoundImages/Features/schwa.png']
            },
            {
                description: 'Phát âm phụ âm /θ/ và /ð/',
                content: `<p>Phụ âm /θ/ và /ð/ là những âm đặc trưng của tiếng Anh, thường được viết bằng "th":</p>
                <ul>
                    <li>/θ/: âm "th" không vang, xuất hiện trong các từ như "think", "health", "mouth"</li>
                    <li>/ð/: âm "th" vang, xuất hiện trong các từ như "this", "mother", "breathe"</li>
                </ul>
                <p>Để phát âm đúng, đặt đầu lưỡi giữa hai hàm răng, để răng trên chạm nhẹ vào lưỡi:</p>
                <ol>
                    <li>Với /θ/: Thổi khí ra không rung dây thanh</li>
                    <li>Với /ð/: Thổi khí ra có rung dây thanh</li>
                </ol>`,
                createdAt: new Date(),
                images: ['https://pronuncian.com/images/SoundImages/Features/voiced-and-unvoiced-th.png']
            },
            {
                description: 'Cách phát âm âm /r/ của tiếng Anh',
                content: `<p>Âm /r/ trong tiếng Anh khác với âm "r" trong tiếng Việt. Phát âm không chính xác có thể khiến người nghe khó hiểu.</p>
                <p>Để phát âm âm /r/ chuẩn:</p>
                <ol>
                    <li>Không rung lưỡi như trong tiếng Việt</li>
                    <li>Cong lưỡi lên nhưng không chạm vào bất kỳ phần nào của miệng</li>
                    <li>Miệng hơi tròn, môi hơi nhô ra</li>
                </ol>
                <p>Thực hành với các từ: red, right, room, around, river</p>`,
                createdAt: new Date(),
                images: ['https://pronuncian.com/images/SoundImages/Features/r-sound.png']
            },
            {
                description: 'Nguyên tắc nhấn trọng âm trong tiếng Anh',
                content: `<p>Nhấn trọng âm đúng là chìa khóa để nói tiếng Anh trôi chảy. Trọng âm không đúng có thể làm thay đổi ý nghĩa của từ.</p>
                <p>Một số quy tắc cơ bản:</p>
                <ol>
                    <li>Danh từ và tính từ thường nhấn âm tiết đầu: PICture, TAble, HAPpy</li>
                    <li>Động từ thường nhấn âm tiết thứ hai: deCIDE, imPROVE</li>
                    <li>Từ có hậu tố "-tion", "-sion" nhấn âm tiết trước nó: information (inforMAtion)</li>
                </ol>
                <p>Thực hành: PREsent (món quà) vs preSENT (trình bày)</p>`,
                createdAt: new Date(),
                images: ['https://www.englishclub.com/images/pronunciation/word-stress-examples.png']
            }
        ];

        const pronunciations = await db.collection('pronunciations').insertMany(pronunciationsData);

        // Lưu trữ tham chiếu
        Object.entries(pronunciations.insertedIds).forEach(([index, id]) => {
            refs.pronunciations[`pron${index}`] = id;
        });

        console.log(`Đã tạo ${pronunciations.insertedCount} bài học phát âm`);

        // 7. Tạo Grammars
        console.log('Đang tạo bài học ngữ pháp...');

        const grammarsData = [
            {
                description: 'Thì hiện tại đơn (Present Simple)',
                content: `<p>Thì hiện tại đơn được dùng để diễn tả:</p>
                <ul>
                    <li>Sự thật hiển nhiên hoặc chân lý: Water boils at 100 degrees Celsius.</li>
                    <li>Thói quen hoặc hành động lặp đi lặp lại: I usually get up at 6 AM.</li>
                    <li>Sở thích hoặc tình trạng: She likes ice cream. / He works at a bank.</li>
                </ul>
                <p><strong>Cấu trúc:</strong></p>
                <ul>
                    <li>(+) S + V(s/es) + O</li>
                    <li>(-) S + don't/doesn't + V + O</li>
                    <li>(?) Do/Does + S + V + O?</li>
                </ul>
                <p><strong>Lưu ý:</strong> Với ngôi thứ 3 số ít (he, she, it), thêm -s hoặc -es vào động từ.</p>
                <p><strong>Ví dụ:</strong></p>
                <ul>
                    <li>He works in a factory. (Anh ấy làm việc trong một nhà máy.)</li>
                    <li>They don't live in Vietnam. (Họ không sống ở Việt Nam.)</li>
                    <li>Do you speak English? (Bạn có nói tiếng Anh không?)</li>
                </ul>`,
                createdAt: new Date(),
                images: ['https://flatworldknowledge.lardbucket.org/books/writers-handbook/section_18/e6f4a1dab4d7eb0c9c6f675f3a7efe47.jpg']
            },
            {
                description: 'Thì hiện tại tiếp diễn (Present Continuous)',
                content: `<p>Thì hiện tại tiếp diễn diễn tả:</p>
                <ul>
                    <li>Hành động đang diễn ra tại thời điểm nói: I am reading a book now.</li>
                    <li>Hành động diễn ra tạm thời: She is staying with her cousin this week.</li>
                    <li>Kế hoạch đã xác định trong tương lai: We are meeting John tonight.</li>
                </ul>
                <p><strong>Cấu trúc:</strong></p>
                <ul>
                    <li>(+) S + am/is/are + V-ing + O</li>
                    <li>(-) S + am/is/are + not + V-ing + O</li>
                    <li>(?) Am/Is/Are + S + V-ing + O?</li>
                </ul>
                <p><strong>Ví dụ:</strong></p>
                <ul>
                    <li>I am writing an email right now. (Tôi đang viết một email ngay bây giờ.)</li>
                    <li>They aren't working today. (Họ không làm việc hôm nay.)</li>
                    <li>Is she cooking dinner? (Cô ấy đang nấu bữa tối phải không?)</li>
                </ul>`,
                createdAt: new Date(),
                images: ['https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX32809011.jpg']
            },
            {
                description: 'Động từ To Be (am, is, are)',
                content: `<p>Động từ "to be" là một trong những động từ cơ bản và quan trọng nhất trong tiếng Anh. Nó có các dạng: am, is, are (hiện tại) và was, were (quá khứ).</p>
                <p><strong>Cách sử dụng trong thì hiện tại:</strong></p>
                <ul>
                    <li>'am' dùng với ngôi thứ nhất số ít (I): I am a student.</li>
                    <li>'is' dùng với ngôi thứ ba số ít (he, she, it): She is happy.</li>
                    <li>'are' dùng với ngôi thứ hai (you) và số nhiều (we, they): They are from Vietnam.</li>
                </ul>
                <p><strong>Cấu trúc câu:</strong></p>
                <ul>
                    <li>(+) S + am/is/are + ...</li>
                    <li>(-) S + am/is/are + not + ...</li>
                    <li>(?) Am/Is/Are + S + ...?</li>
                </ul>
                <p><strong>Ví dụ:</strong></p>
                <ul>
                    <li>I am a doctor. (Tôi là bác sĩ.)</li>
                    <li>He is not at home. (Anh ấy không có ở nhà.)</li>
                    <li>Are they students? (Họ có phải là học sinh không?)</li>
                </ul>`,
                createdAt: new Date(),
                images: ['https://7esl.com/wp-content/uploads/2018/03/TO-BE-1.png']
            },
            {
                description: 'Thì quá khứ đơn (Past Simple)',
                content: `<p>Thì quá khứ đơn dùng để diễn tả:</p>
                <ul>
                    <li>Hành động đã xảy ra và kết thúc ở thời điểm xác định trong quá khứ: I visited Paris last summer.</li>
                    <li>Chuỗi hành động diễn ra liên tiếp trong quá khứ: He got up, had breakfast, and went to work.</li>
                </ul>
                <p><strong>Cấu trúc:</strong></p>
                <ul>
                    <li>(+) S + V-ed/V2 + O</li>
                    <li>(-) S + didn't + V + O</li>
                    <li>(?) Did + S + V + O?</li>
                </ul>
                <p><strong>Lưu ý:</strong> Động từ bất quy tắc có dạng quá khứ riêng (go → went, see → saw).</p>
                <p><strong>Ví dụ:</strong></p>
                <ul>
                    <li>She watched a movie yesterday. (Cô ấy đã xem một bộ phim hôm qua.)</li>
                    <li>We didn't study last night. (Chúng tôi đã không học tối qua.)</li>
                    <li>Did they visit the museum? (Họ đã thăm bảo tàng phải không?)</li>
                </ul>`,
                createdAt: new Date(),
                images: ['https://i.ytimg.com/vi/QaERLpS1HrM/maxresdefault.jpg']
            },
            {
                description: 'Câu điều kiện loại 1 (First Conditional)',
                content: `<p>Câu điều kiện loại 1 diễn tả một điều kiện có thể xảy ra trong tương lai và kết quả có thể sẽ xảy ra nếu điều kiện đó được thỏa mãn.</p>
                <p><strong>Cấu trúc:</strong></p>
                <p>If + S + V (hiện tại đơn), S + will + V + ...</p>
                <p><strong>Ví dụ:</strong></p>
                <ul>
                    <li>If it rains tomorrow, I will stay at home. (Nếu trời mưa ngày mai, tôi sẽ ở nhà.)</li>
                    <li>If you study hard, you will pass the exam. (Nếu bạn học chăm chỉ, bạn sẽ vượt qua kỳ thi.)</li>
                </ul>
                <p><strong>Lưu ý:</strong></p>
                <ul>
                    <li>Có thể thay thế "will" bằng "can", "may", "might", "should" tùy theo mức độ chắc chắn.</li>
                    <li>Có thể đảo vị trí hai mệnh đề, nhưng nếu mệnh đề "If" đứng sau thì không cần dấu phẩy.</li>
                </ul>`,
                createdAt: new Date(),
                images: ['https://www.englishclub.com/images/grammar/conditional-type-1.png']
            }
        ];

        const grammars = await db.collection('grammars').insertMany(grammarsData);

        // Lưu trữ tham chiếu
        Object.entries(grammars.insertedIds).forEach(([index, id]) => {
            refs.grammars[`grammar${index}`] = id;
        });

        console.log(`Đã tạo ${grammars.insertedCount} bài học ngữ pháp`);

        // 8. Tạo Stages
        console.log('Đang tạo giai đoạn học tập...');

        const stagesData = [
            // Stages cho gate "Làm quen với tiếng Anh" (gate0)
            {
                title: 'Bảng chữ cái và số đếm',
                description: 'Học bảng chữ cái tiếng Anh và cách phát âm từng chữ cái, cùng với số đếm từ 1-100.',
                gate: refs.gates.gate0,
                sortOrder: 1,
                questions: [
                    {
                        question: 'Chữ cái nào phát âm là /eɪ/?',
                        type: 'multiple-choice',
                        options: ['A', 'B', 'C', 'D'],
                        correctAnswer: 'A',
                        explanation: 'Chữ A trong tiếng Anh phát âm là /eɪ/.'
                    },
                    {
                        question: 'Chữ cái nào phát âm là /zed/ trong tiếng Anh-Anh?',
                        type: 'multiple-choice',
                        options: ['X', 'Y', 'Z', 'W'],
                        correctAnswer: 'Z',
                        explanation: 'Chữ Z phát âm là /zed/ trong tiếng Anh-Anh và /zi:/ trong tiếng Anh-Mỹ.'
                    },
                    {
                        question: 'Đâu là cách đọc số 21 trong tiếng Anh?',
                        type: 'multiple-choice',
                        options: ['Twenty-one', 'Two-one', 'Twenty first', 'Two and one'],
                        correctAnswer: 'Twenty-one',
                        explanation: 'Số 21 được đọc là "twenty-one" trong tiếng Anh.'
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Chào hỏi và giới thiệu',
                description: 'Học các cách chào hỏi và giới thiệu bản thân trong tiếng Anh.',
                gate: refs.gates.gate0,
                sortOrder: 2,
                questions: [
                    {
                        question: 'Cách nói "Chào buổi sáng" trong tiếng Anh là gì?',
                        type: 'multiple-choice',
                        options: ['Good morning', 'Good evening', 'Good afternoon', 'Good night'],
                        correctAnswer: 'Good morning',
                        explanation: 'Good morning là cách chào buổi sáng trong tiếng Anh.'
                    },
                    {
                        question: 'Hoàn thành câu: "_____ name is John."',
                        type: 'multiple-choice',
                        options: ['I', 'My', 'Me', 'Mine'],
                        correctAnswer: 'My',
                        explanation: 'Để giới thiệu tên, chúng ta sử dụng "My name is..."'
                    },
                    {
                        question: 'Cách hỏi "Bạn khỏe không?" trong tiếng Anh là gì?',
                        type: 'multiple-choice',
                        options: ['How are you?', 'Who are you?', 'Where are you?', 'What are you?'],
                        correctAnswer: 'How are you?',
                        explanation: '"How are you?" là cách hỏi thăm sức khỏe hoặc tình trạng của người khác.'
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },

            // Stages cho gate "Giao tiếp cơ bản" (gate1)
            {
                title: 'Hỏi đường và phương hướng',
                description: 'Học cách hỏi và chỉ đường trong tiếng Anh, cùng các từ vựng về phương hướng.',
                gate: refs.gates.gate1,
                sortOrder: 1,
                questions: [
                    {
                        question: 'Câu nào sau đây dùng để hỏi đường?',
                        type: 'multiple-choice',
                        options: [
                            'Excuse me, could you tell me the way to the station?',
                            'Excuse me, what is your name?',
                            'Excuse me, what time is it?',
                            'Excuse me, how much is this?'
                        ],
                        correctAnswer: 'Excuse me, could you tell me the way to the station?',
                        explanation: 'Câu "Excuse me, could you tell me the way to the station?" dùng để hỏi đường đến nhà ga.'
                    },
                    {
                        question: 'Từ nào KHÔNG phải là hướng trong tiếng Anh?',
                        type: 'multiple-choice',
                        options: ['North', 'South', 'East', 'Forward'],
                        correctAnswer: 'Forward',
                        explanation: 'North (Bắc), South (Nam), East (Đông) là các hướng chính. "Forward" có nghĩa là "về phía trước", không phải hướng cố định.'
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Mua sắm và giá cả',
                description: 'Học cách giao tiếp khi mua sắm, hỏi giá, mặc cả và mô tả sản phẩm.',
                gate: refs.gates.gate1,
                sortOrder: 2,
                questions: [
                    {
                        question: 'Câu nào dùng để hỏi giá?',
                        type: 'multiple-choice',
                        options: ['How much is this?', 'What is this?', 'Where is this?', 'When is this?'],
                        correctAnswer: 'How much is this?',
                        explanation: '"How much is this?" dùng để hỏi giá của một món hàng.'
                    },
                    {
                        question: 'Để nói "Tôi muốn cái này", bạn nói:',
                        type: 'multiple-choice',
                        options: ['I want this one', 'I need one', 'Give me that', 'This is mine'],
                        correctAnswer: 'I want this one',
                        explanation: '"I want this one" là cách lịch sự để nói bạn muốn mua món hàng đó.'
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },

            // Stages cho gate "Ngữ pháp cơ bản" (gate2)
            {
                title: 'Động từ To Be',
                description: 'Học cách sử dụng động từ "to be" (am, is, are) trong các câu đơn giản.',
                gate: refs.gates.gate2,
                sortOrder: 1,
                questions: [
                    {
                        question: 'Complete the sentence: She ____ a doctor.',
                        type: 'multiple-choice',
                        options: ['am', 'is', 'are', 'be'],
                        correctAnswer: 'is',
                        explanation: 'Với chủ ngữ là "She" (ngôi thứ 3, số ít), chúng ta dùng "is".'
                    },
                    {
                        question: 'Complete the sentence: I ____ a student.',
                        type: 'multiple-choice',
                        options: ['am', 'is', 'are', 'be'],
                        correctAnswer: 'am',
                        explanation: 'Với chủ ngữ là "I" (ngôi thứ nhất, số ít), chúng ta dùng "am".'
                    },
                    {
                        question: 'Complete the sentence: They ____ from Vietnam.',
                        type: 'multiple-choice',
                        options: ['am', 'is', 'are', 'be'],
                        correctAnswer: 'are',
                        explanation: 'Với chủ ngữ là "They" (số nhiều), chúng ta dùng "are".'
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Thì hiện tại đơn',
                description: 'Học cách sử dụng thì hiện tại đơn để diễn tả thói quen và sự thật.',
                gate: refs.gates.gate2,
                sortOrder: 2,
                questions: [
                    {
                        question: 'He ____ to school every day.',
                        type: 'multiple-choice',
                        options: ['go', 'goes', 'going', 'went'],
                        correctAnswer: 'goes',
                        explanation: 'Trong thì hiện tại đơn, với chủ ngữ ngôi thứ 3 số ít (he, she, it), động từ thêm "s/es".'
                    },
                    {
                        question: 'They ____ breakfast at 7 AM.',
                        type: 'multiple-choice',
                        options: ['has', 'have', 'having', 'had'],
                        correctAnswer: 'have',
                        explanation: 'Với chủ ngữ số nhiều "They", chúng ta dùng động từ không thêm "s/es".'
                    },
                    {
                        question: 'What time ____ the movie start?',
                        type: 'multiple-choice',
                        options: ['do', 'does', 'is', 'are'],
                        correctAnswer: 'does',
                        explanation: 'Câu hỏi trong thì hiện tại đơn với chủ ngữ ngôi thứ 3 số ít (the movie) dùng "does".'
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },

            // Stages cho gate "IELTS Writing" (gate10)
            {
                title: 'Task 1: Biểu đồ và bảng dữ liệu',
                description: 'Học cách phân tích và mô tả biểu đồ, bảng dữ liệu trong IELTS Writing Task 1.',
                gate: refs.gates.gate10,
                sortOrder: 1,
                questions: [
                    {
                        question: 'Trong bài Task 1, câu đầu tiên thường làm gì?',
                        type: 'multiple-choice',
                        options: [
                            'Giới thiệu tổng quát về biểu đồ/bảng dữ liệu',
                            'Trình bày ý kiến cá nhân',
                            'Kết luận xu hướng',
                            'So sánh các số liệu'
                        ],
                        correctAnswer: 'Giới thiệu tổng quát về biểu đồ/bảng dữ liệu',
                        explanation: 'Câu đầu tiên trong IELTS Writing Task 1 thường là câu paraphrase (diễn giải lại) đề bài, giới thiệu tổng quát nội dung của biểu đồ/bảng dữ liệu.'
                    },
                    {
                        question: 'Từ nào KHÔNG phải là từ dùng để mô tả xu hướng tăng?',
                        type: 'multiple-choice',
                        options: ['increase', 'rise', 'grow', 'decline'],
                        correctAnswer: 'decline',
                        explanation: '"decline" có nghĩa là "giảm". Các từ còn lại đều mô tả xu hướng tăng.'
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Task 2: Essay viết luận',
                description: 'Học cách viết bài luận cho IELTS Writing Task 2, cấu trúc và từ vựng học thuật.',
                gate: refs.gates.gate10,
                sortOrder: 2,
                questions: [
                    {
                        question: 'Cấu trúc nào sau đây đúng cho bài IELTS Writing Task 2?',
                        type: 'multiple-choice',
                        options: [
                            'Mở bài - Thân bài - Kết luận',
                            'Giới thiệu dữ liệu - Phân tích - Xu hướng',
                            'Mở đầu - Ưu điểm - Nhược điểm - Kết luận',
                            'Tiêu đề - Nội dung - Tóm tắt'
                        ],
                        correctAnswer: 'Mở bài - Thân bài - Kết luận',
                        explanation: 'Cấu trúc chuẩn cho bài IELTS Writing Task 2 gồm: Mở bài (Introduction), Thân bài (Body paragraphs) và Kết luận (Conclusion).'
                    },
                    {
                        question: 'Trong IELTS Writing Task 2, độ dài bài viết tối thiểu nên là:',
                        type: 'multiple-choice',
                        options: ['150 từ', '200 từ', '250 từ', '300 từ'],
                        correctAnswer: '250 từ',
                        explanation: 'IELTS Writing Task 2 yêu cầu viết ít nhất 250 từ. Viết ít hơn sẽ bị trừ điểm.'
                    }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        const stages = await db.collection('stages').insertMany(stagesData);

        // Lưu trữ tham chiếu
        Object.entries(stages.insertedIds).forEach(([index, id]) => {
            refs.stages[`stage${index}`] = id;
        });

        console.log(`Đã tạo ${stages.insertedCount} giai đoạn học tập`);

        // Cập nhật gates với stages
        await db.collection('gates').updateOne(
            { _id: refs.gates.gate0 },
            { $set: { stages: [refs.stages.stage0, refs.stages.stage1] } }
        );

        await db.collection('gates').updateOne(
            { _id: refs.gates.gate1 },
            { $set: { stages: [refs.stages.stage2, refs.stages.stage3] } }
        );

        await db.collection('gates').updateOne(
            { _id: refs.gates.gate2 },
            { $set: { stages: [refs.stages.stage4, refs.stages.stage5] } }
        );

        await db.collection('gates').updateOne(
            { _id: refs.gates.gate10 },
            { $set: { stages: [refs.stages.stage6, refs.stages.stage7] } }
        );

        // 9. Tạo Pronunciation Exercises
        console.log('Đang tạo bài tập phát âm...');

        const pronunciationExercises = [];

        // Bài tập luyện âm /æ/
        const pronExercise1 = new PronunciationExercise();
        pronExercise1._id = new mongoose.Types.ObjectId();
        pronExercise1.title = 'Luyện âm /æ/';

        pronExercise1.addQuestion(
            'Từ nào có chứa âm /æ/?',
            'multiple-choice',
            'cat',
            'Từ "cat" phát âm là /kæt/ và chứa âm /æ/.',
            ['cat', 'cute', 'cot', 'kite']
        );

        pronExercise1.addQuestion(
            'Từ nào có chứa âm /æ/?',
            'multiple-choice',
            'map',
            'Từ "map" phát âm là /mæp/ và chứa âm /æ/.',
            ['map', 'mop', 'moon', 'mute']
        );

        pronExercise1.addQuestion(
            'Nghe và chọn từ chứa âm /æ/:',
            'multiple-choice',
            'apple',
            'Từ "apple" phát âm là /ˈæpl/ và chứa âm /æ/ ở âm tiết đầu.',
            ['orange', 'apple', 'lemon', 'cherry']
        );

        // Bài tập luyện âm /ə/ (schwa)
        const pronExercise2 = new PronunciationExercise();
        pronExercise2._id = new mongoose.Types.ObjectId();
        pronExercise2.title = 'Luyện âm schwa /ə/';

        pronExercise2.addQuestion(
            'Từ nào KHÔNG có âm /ə/?',
            'multiple-choice',
            'sit',
            'Từ "sit" không chứa âm schwa /ə/. Các từ khác đều có âm schwa ở ít nhất một âm tiết.',
            ['about', 'sit', 'banana', 'computer']
        );

        pronExercise2.addQuestion(
            'Từ nào có âm /ə/ ở âm tiết cuối?',
            'multiple-choice',
            'teacher',
            'Từ "teacher" có âm schwa /ə/ ở âm tiết cuối, phát âm là /ˈtiːtʃə/.',
            ['teacher', 'about', 'again', 'apply']
        );

        pronExercise2.addQuestion(
            'Âm tiết nào trong từ "international" có âm /ə/?',
            'multiple-choice',
            'na, tio và nal',
            'Trong từ "international" /ˌɪntəˈnæʃənl/, âm schwa xuất hiện ở các âm tiết "na", "tio" và "nal".',
            ['in và ter', 'na, tio và nal', 'chỉ có âm tiết in', 'không có âm tiết nào']
        );

        // Bài tập luyện âm /θ/ và /ð/
        const pronExercise3 = new PronunciationExercise();
        pronExercise3._id = new mongoose.Types.ObjectId();
        pronExercise3.title = 'Luyện âm /θ/ và /ð/';

        pronExercise3.addQuestion(
            'Từ nào có âm /θ/ (th không vang)?',
            'multiple-choice',
            'think',
            'Từ "think" có âm /θ/ (th không vang), phát âm là /θɪŋk/.',
            ['think', 'this', 'they', 'mother']
        );

        pronExercise3.addQuestion(
            'Từ nào có âm /ð/ (th vang)?',
            'multiple-choice',
            'brother',
            'Từ "brother" có âm /ð/ (th vang), phát âm là /ˈbrʌðə/.',
            ['breath', 'health', 'brother', 'mouth']
        );

        // Chuyển đối tượng thành document để insert vào MongoDB
        pronunciationExercises.push(
            {
                _id: pronExercise1._id,
                title: pronExercise1.title,
                questions: pronExercise1.questions,
                createdAt: pronExercise1.createdAt
            },
            {
                _id: pronExercise2._id,
                title: pronExercise2.title,
                questions: pronExercise2.questions,
                createdAt: pronExercise2.createdAt
            },
            {
                _id: pronExercise3._id,
                title: pronExercise3.title,
                questions: pronExercise3.questions,
                createdAt: pronExercise3.createdAt
            }
        );

        // Inserting the pronunciation exercises
        const pronExResult = await db.collection('pronunciationexercises').insertMany(pronunciationExercises);
        console.log(`Đã tạo ${pronExResult.insertedCount} bài tập phát âm`);

        // 10. Tạo Grammar Exercises
        console.log('Đang tạo bài tập ngữ pháp...');

        const grammarExercises = [];

        // Bài tập hiện tại đơn
        const grammarExercise1 = new GrammarExercise();
        grammarExercise1._id = new mongoose.Types.ObjectId();
        grammarExercise1.title = 'Bài tập thì hiện tại đơn';

        grammarExercise1.addQuestion(
            'He ____ to school every day.',
            'multiple-choice',
            'goes',
            'Với chủ ngữ là "He" (ngôi thứ 3, số ít), động từ "go" phải thêm "es" thành "goes" trong thì hiện tại đơn.',
            ['go', 'goes', 'going', 'went']
        );

        grammarExercise1.addQuestion(
            'They ____ breakfast at 7 AM.',
            'multiple-choice',
            'have',
            'Với chủ ngữ là "They" (số nhiều), động từ không thêm "s/es" trong thì hiện tại đơn.',
            ['has', 'have', 'having', 'had']
        );

        // Bài tập động từ To Be
        const grammarExercise2 = new GrammarExercise();
        grammarExercise2._id = new mongoose.Types.ObjectId();
        grammarExercise2.title = 'Bài tập động từ To Be';

        grammarExercise2.addQuestion(
            'I ____ a student.',
            'multiple-choice',
            'am',
            'Với chủ ngữ "I", dùng "am" là dạng đúng của động từ to be trong thì hiện tại.',
            ['am', 'is', 'are', 'be']
        );

        grammarExercise2.addQuestion(
            'They ____ not at home now.',
            'multiple-choice',
            'are',
            'Với chủ ngữ "They", dùng "are" là dạng đúng của động từ to be trong thì hiện tại.',
            ['am', 'is', 'are', 'be']
        );

        grammarExercise2.addQuestion(
            'Rewrite: She is tall. -> ____',
            'rewrite',
            'Is she tall?',
            'Để chuyển câu khẳng định với "be" thành câu hỏi, đưa động từ "be" lên trước chủ ngữ.',
            []
        );

        // Bài tập hiện tại tiếp diễn
        const grammarExercise3 = new GrammarExercise();
        grammarExercise3._id = new mongoose.Types.ObjectId();
        grammarExercise3.title = 'Bài tập thì hiện tại tiếp diễn';

        grammarExercise3.addQuestion(
            'Look! The baby ____ (sleep).',
            'fill-in-the-blank',
            'is sleeping',
            'Trong thì hiện tại tiếp diễn, với chủ ngữ ngôi thứ 3 số ít (the baby), cấu trúc là "is + V-ing".',
            []
        );

        grammarExercise3.addQuestion(
            'They ____ (not/watch) TV right now.',
            'fill-in-the-blank',
            'aren\'t watching',
            'Trong thì hiện tại tiếp diễn, dạng phủ định với chủ ngữ số nhiều (they) là "aren\'t + V-ing".',
            []
        );

        // Chuyển đối tượng thành document để insert vào MongoDB
        grammarExercises.push(
            {
                _id: grammarExercise1._id,
                title: grammarExercise1.title,
                questions: grammarExercise1.questions,
                createdAt: grammarExercise1.createdAt
            },
            {
                _id: grammarExercise2._id,
                title: grammarExercise2.title,
                questions: grammarExercise2.questions,
                createdAt: grammarExercise2.createdAt
            },
            {
                _id: grammarExercise3._id,
                title: grammarExercise3.title,
                questions: grammarExercise3.questions,
                createdAt: grammarExercise3.createdAt
            }
        );

        // Inserting the grammar exercises
        const grammarExResult = await db.collection('grammarexercises').insertMany(grammarExercises);
        console.log(`Đã tạo ${grammarExResult.insertedCount} bài tập ngữ pháp`);

        // 11. Tạo Vocabulary Exercises
        console.log('Đang tạo bài tập từ vựng...');

        const vocabularyExercises = [];

        // Bài tập từ vựng về gia đình
        const vocabExercise1 = new VocabularyExercise();
        vocabExercise1._id = new mongoose.Types.ObjectId();
        vocabExercise1.title = 'Từ vựng về gia đình';

        vocabExercise1.addQuestion(
            'Father\'s sister is your ____.',
            'multiple-choice',
            'aunt',
            'Em gái hoặc chị gái của bố được gọi là "aunt" (dì/cô).',
            ['aunt', 'uncle', 'niece', 'nephew']
        );

        vocabExercise1.addQuestion(
            'Mother\'s mother is your ____.',
            'multiple-choice',
            'grandmother',
            'Mẹ của mẹ được gọi là "grandmother" (bà ngoại).',
            ['grandmother', 'grandfather', 'granddaughter', 'grandson']
        );

        vocabExercise1.addQuestion(
            'Your sister\'s son is your ____.',
            'multiple-choice',
            'nephew',
            'Con trai của chị/em gái bạn được gọi là "nephew" (cháu trai).',
            ['niece', 'nephew', 'cousin', 'son']
        );

        // Bài tập từ vựng về thức ăn
        const vocabExercise2 = new VocabularyExercise();
        vocabExercise2._id = new mongoose.Types.ObjectId();
        vocabExercise2.title = 'Từ vựng về thức ăn và nhà hàng';

        vocabExercise2.addQuestion(
            'Món ăn được phục vụ trước bữa ăn chính gọi là:',
            'multiple-choice',
            'appetizer',
            '"Appetizer" là món khai vị, được phục vụ trước bữa ăn chính.',
            ['appetizer', 'dessert', 'main course', 'beverage']
        );

        vocabExercise2.addQuestion(
            'Món ăn ngọt được phục vụ sau bữa ăn chính gọi là:',
            'multiple-choice',
            'dessert',
            '"Dessert" là món tráng miệng, thường có vị ngọt và được phục vụ sau bữa ăn chính.',
            ['appetizer', 'dessert', 'main course', 'side dish']
        );

        vocabExercise2.addQuestion(
            'Người phục vụ trong nhà hàng được gọi là:',
            'multiple-choice',
            'waiter/waitress',
            '"Waiter" (nam) hoặc "waitress" (nữ) là người phục vụ trong nhà hàng.',
            ['chef', 'waiter/waitress', 'manager', 'bartender']
        );

        // Bài tập từ vựng học thuật IELTS
        const vocabExercise3 = new VocabularyExercise();
        vocabExercise3._id = new mongoose.Types.ObjectId();
        vocabExercise3.title = 'Từ vựng học thuật IELTS';

        vocabExercise3.addQuestion(
            'Choose the synonym of "significant":',
            'multiple-choice',
            'important',
            '"Significant" có nghĩa là "quan trọng, đáng kể", tương đồng với "important".',
            ['important', 'small', 'unclear', 'simple']
        );

        vocabExercise3.addQuestion(
            'Choose the synonym of "controversial":',
            'multiple-choice',
            'debatable',
            '"Controversial" có nghĩa là "gây tranh cãi", tương đồng với "debatable" (có thể tranh luận).',
            ['debatable', 'accepted', 'traditional', 'established']
        );

        vocabExercise3.addQuestion(
            'Choose the antonym of "benefit":',
            'multiple-choice',
            'drawback',
            '"Benefit" (lợi ích) trái nghĩa với "drawback" (bất lợi, nhược điểm).',
            ['advantage', 'profit', 'drawback', 'improvement']
        );

        // Chuyển đối tượng thành document để insert vào MongoDB
        vocabularyExercises.push(
            {
                _id: vocabExercise1._id,
                title: vocabExercise1.title,
                questions: vocabExercise1.questions,
                createdAt: vocabExercise1.createdAt
            },
            {
                _id: vocabExercise2._id,
                title: vocabExercise2.title,
                questions: vocabExercise2.questions,
                createdAt: vocabExercise2.createdAt
            },
            {
                _id: vocabExercise3._id,
                title: vocabExercise3.title,
                questions: vocabExercise3.questions,
                createdAt: vocabExercise3.createdAt
            }
        );

        // Inserting the vocabulary exercises
        const vocabExResult = await db.collection('vocabularyexercises').insertMany(vocabularyExercises);
        console.log(`Đã tạo ${vocabExResult.insertedCount} bài tập từ vựng`);

        // 12. Tạo Blogs
        console.log('Đang tạo blogs...');

        const blogsData = [
            {
                title: '10 bí quyết học tiếng Anh hiệu quả',
                content: `
                <p>Học tiếng Anh hiệu quả đòi hỏi phương pháp phù hợp và kiên trì thực hành. Dưới đây là 10 bí quyết giúp bạn cải thiện khả năng tiếng Anh:</p>
                <ol>
                    <li><strong>Học từ vựng theo chủ đề</strong>: Thay vì học các từ riêng lẻ, hãy tổ chức từ vựng theo chủ đề để dễ nhớ và áp dụng.</li>
                    <li><strong>Thực hành nói mỗi ngày</strong>: Dành ít nhất 15 phút mỗi ngày để nói tiếng Anh, ngay cả khi bạn chỉ nói một mình.</li>
                    <li><strong>Xem phim, nghe nhạc bằng tiếng Anh</strong>: Đắm mình trong ngôn ngữ qua các phương tiện giải trí yêu thích.</li>
                    <li><strong>Tham gia các cộng đồng học tiếng Anh</strong>: Kết nối với người học và người bản ngữ để thực hành giao tiếp thực tế.</li>
                    <li><strong>Đọc sách, báo tiếng Anh hàng ngày</strong>: Bắt đầu với tài liệu đơn giản và dần dần tăng độ khó.</li>
                    <li><strong>Học qua ứng dụng di động</strong>: Tận dụng thời gian rảnh với các ứng dụng học tiếng Anh.</li>
                    <li><strong>Viết nhật ký bằng tiếng Anh</strong>: Rèn luyện kỹ năng viết và mở rộng vốn từ vựng qua việc ghi chép hàng ngày.</li>
                    <li><strong>Học ngữ pháp trong ngữ cảnh</strong>: Thay vì học quy tắc ngữ pháp khô khan, hãy học qua ví dụ và tình huống thực tế.</li>
                    <li><strong>Luyện phát âm với người bản ngữ</strong>: Chú ý đến cách phát âm chính xác và học cách nhấn trọng âm.</li>
                    <li><strong>Đặt mục tiêu cụ thể và theo dõi tiến độ</strong>: Lên kế hoạch học tập với các mục tiêu ngắn hạn và dài hạn, đồng thời theo dõi quá trình cải thiện.</li>
                </ol>
                <p>Hãy nhớ rằng việc học tiếng Anh là một hành trình, không phải một đích đến. Kiên trì và thực hành đều đặn là chìa khóa để thành công!</p>`,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: '5 cách cải thiện kỹ năng nghe tiếng Anh',
                content: `
                <p>Kỹ năng nghe là một trong những kỹ năng quan trọng nhất khi học tiếng Anh, nhưng cũng thường là kỹ năng khó nhất đối với người học. Dưới đây là 5 cách hiệu quả giúp bạn cải thiện kỹ năng nghe:</p>
                <ol>
                    <li><strong>Nghe podcast tiếng Anh hàng ngày</strong>: Podcast là nguồn tài liệu tuyệt vời để luyện nghe với nhiều chủ đề và cấp độ khác nhau. Bắt đầu với các podcast có tốc độ nói chậm và dần dần chuyển sang các podcast thông thường dành cho người bản ngữ.</li>
                    <li><strong>Xem phim không phụ đề hoặc với phụ đề tiếng Anh</strong>: Ban đầu, bạn có thể xem với phụ đề tiếng Việt, sau đó chuyển sang phụ đề tiếng Anh và cuối cùng là không sử dụng phụ đề. Hãy chọn những bộ phim hoặc chương trình TV mà bạn đã quen thuộc với nội dung.</li>
                    <li><strong>Tham gia các cuộc hội thoại với người bản ngữ</strong>: Giao tiếp trực tiếp với người bản ngữ là cách tốt nhất để rèn luyện kỹ năng nghe trong tình huống thực tế. Bạn có thể tìm kiếm các đối tác ngôn ngữ qua các ứng dụng như Tandem, HelloTalk hoặc tham gia các sự kiện giao lưu ngôn ngữ.</li>
                    <li><strong>Học nghe theo cụm từ, không phải từng từ</strong>: Thay vì cố gắng nghe và hiểu từng từ riêng lẻ, hãy tập trung vào các cụm từ và ý nghĩa tổng thể. Người bản ngữ thường nói nhanh và nối các từ lại với nhau, vì vậy việc hiểu các cụm từ sẽ giúp bạn nghe hiệu quả hơn.</li>
                    <li><strong>Thực hành nghe với nhiều giọng điệu khác nhau</strong>: Tiếng Anh có nhiều giọng điệu vùng miền khác nhau, từ Anh, Mỹ, Australia, Canada đến các quốc gia nói tiếng Anh như ngôn ngữ thứ hai. Việc làm quen với nhiều giọng điệu sẽ giúp bạn linh hoạt trong giao tiếp thực tế.</li>
                </ol>
                <p>Hãy nhớ rằng việc cải thiện kỹ năng nghe đòi hỏi thời gian và sự kiên trì. Thực hành đều đặn mỗi ngày, dù chỉ 15-20 phút, sẽ mang lại hiệu quả tốt hơn so với học nhiều giờ nhưng không thường xuyên.</p>`,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Lộ trình học IELTS từ 0 đến 7.0+',
                content: `
                <p>Nhiều người học tiếng Anh mong muốn đạt được điểm IELTS cao nhưng không biết bắt đầu từ đâu. Dưới đây là lộ trình học IELTS hiệu quả từ cơ bản đến nâng cao:</p>
                
                <h3>Giai đoạn 1: Xây dựng nền tảng (1-3 tháng)</h3>
                <ul>
                    <li>Học và củng cố ngữ pháp cơ bản đến trung cấp</li>
                    <li>Xây dựng vốn từ vựng cơ bản (khoảng 3000-4000 từ)</li>
                    <li>Làm quen với cấu trúc bài thi IELTS và các dạng câu hỏi</li>
                    <li>Luyện phát âm chuẩn và nghe hiểu cơ bản</li>
                </ul>
                
                <h3>Giai đoạn 2: Phát triển kỹ năng (2-4 tháng)</h3>
                <ul>
                    <li>Học từ vựng học thuật và từ vựng theo chủ đề IELTS</li>
                    <li>Rèn luyện kỹ năng đọc với các chiến lược đọc lướt, đọc tìm ý chính</li>
                    <li>Luyện viết các dạng Task 1 và Task 2 cơ bản</li>
                    <li>Phát triển kỹ năng nghe với các bài nghe đa dạng</li>
                    <li>Tập nói theo các chủ đề thông dụng trong IELTS Speaking</li>
                </ul>
                
                <h3>Giai đoạn 3: Nâng cao và hoàn thiện (1-3 tháng)</h3>
                <ul>
                    <li>Mở rộng vốn từ vựng học thuật nâng cao</li>
                    <li>Thực hành với các bài thi IELTS đầy đủ và tính giờ</li>
                    <li>Phân tích lỗi sai và cải thiện điểm yếu</li>
                    <li>Học các cấu trúc ngữ pháp phức tạp và cách sử dụng linh hoạt</li>
                    <li>Nâng cao kỹ năng viết với các cấu trúc câu đa dạng và từ vựng học thuật</li>
                </ul>
                
                <p><strong>Lưu ý quan trọng:</strong></p>
                <ul>
                    <li>Lộ trình trên chỉ mang tính tham khảo, thời gian học tập sẽ phụ thuộc vào trình độ ban đầu và thời gian bạn có thể dành cho việc học.</li>
                    <li>Thực hành đều đặn mỗi ngày quan trọng hơn học nhiều giờ trong một ngày.</li>
                    <li>Nên có giáo viên hoặc người hướng dẫn để nhận phản hồi và điều chỉnh quá trình học tập.</li>
                    <li>Làm nhiều bài thi thử để làm quen với định dạng và áp lực thời gian của bài thi thật.</li>
                </ul>
                
                <p>Hãy nhớ rằng việc học IELTS không chỉ là để đạt điểm cao trong kỳ thi mà còn là cơ hội để nâng cao khả năng tiếng Anh tổng thể của bạn. Kiên trì và thực hành thường xuyên sẽ mang lại kết quả tốt!</p>`,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Phương pháp học từ vựng tiếng Anh hiệu quả',
                content: `
                <p>Việc học và nhớ từ vựng tiếng Anh luôn là thách thức đối với nhiều người học. Dưới đây là những phương pháp học từ vựng hiệu quả giúp bạn ghi nhớ lâu dài:</p>
                
                <h3>1. Học từ trong ngữ cảnh</h3>
                <p>Thay vì học từ vựng riêng lẻ, hãy học chúng trong câu hoặc đoạn văn. Điều này giúp bạn hiểu cách sử dụng từ trong tình huống thực tế và dễ nhớ hơn.</p>
                
                <h3>2. Sử dụng phương pháp Spaced Repetition</h3>
                <p>Đây là phương pháp ôn tập theo khoảng thời gian tăng dần. Khi bạn vừa học một từ mới, bạn nên ôn lại nó sau một ngày, sau đó ba ngày, một tuần, hai tuần, và cứ tiếp tục như vậy. Các ứng dụng như Anki hoặc Quizlet có thể giúp bạn thực hiện phương pháp này.</p>
                
                <h3>3. Sử dụng flashcard</h3>
                <p>Flashcard là công cụ học từ vựng cổ điển nhưng vẫn rất hiệu quả. Bạn có thể tự tạo flashcard bằng giấy hoặc sử dụng các ứng dụng trên điện thoại. Mỗi flashcard nên có từ tiếng Anh ở một mặt và nghĩa, ví dụ, cách phát âm ở mặt còn lại.</p>
                
                <h3>4. Phân loại từ vựng theo chủ đề</h3>
                <p>Học từ vựng theo nhóm chủ đề (như gia đình, thực phẩm, du lịch...) giúp bạn liên kết các từ với nhau và dễ nhớ hơn. Ngoài ra, khi cần sử dụng trong tình huống cụ thể, bạn sẽ dễ dàng truy xuất các từ liên quan.</p>
                
                <h3>5. Sử dụng kỹ thuật liên tưởng</h3>
                <p>Tạo ra những hình ảnh hoặc câu chuyện vui nhộn, thậm chí là vô lý để gắn với từ mới. Não bộ của chúng ta có xu hướng nhớ những điều bất thường hoặc hài hước.</p>
                
                <h3>6. Học qua hình ảnh và âm thanh</h3>
                <p>Kết hợp từ vựng với hình ảnh và cách phát âm giúp tăng cường trí nhớ. Nhiều ứng dụng học từ vựng hiện nay đã tích hợp cả hình ảnh minh họa và file âm thanh phát âm.</p>
                
                <h3>7. Sử dụng từ vựng mới trong giao tiếp</h3>
                <p>Thực hành sử dụng từ vựng mới trong hội thoại, viết nhật ký hoặc bài luận. Việc áp dụng từ vựng vào thực tế giúp bạn nhớ lâu hơn và hiểu sâu hơn về cách sử dụng từ.</p>
                
                <h3>8. Đọc nhiều và đa dạng</h3>
                <p>Đọc sách, báo, tạp chí, blog bằng tiếng Anh giúp bạn tiếp xúc với từ vựng trong ngữ cảnh tự nhiên. Bắt đầu với các tài liệu phù hợp với trình độ của bạn và dần dần tăng độ khó.</p>
                
                <p>Hãy nhớ rằng, học từ vựng là một quá trình liên tục. Kiên trì thực hành hàng ngày, kết hợp nhiều phương pháp khác nhau sẽ giúp bạn xây dựng vốn từ vựng phong phú và nhớ lâu hơn.</p>`,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Cách phát âm tiếng Anh chuẩn như người bản ngữ',
                content: `
                <p>Phát âm chuẩn là một trong những yếu tố quan trọng giúp giao tiếp tiếng Anh trôi chảy và tự tin. Dưới đây là những bí quyết để phát âm tiếng Anh như người bản ngữ:</p>
                
                <h3>1. Hiểu rõ về IPA (International Phonetic Alphabet)</h3>
                <p>Bảng phiên âm quốc tế IPA là công cụ cực kỳ hữu ích để học phát âm. Mỗi ký hiệu trong IPA đại diện cho một âm cụ thể, giúp bạn biết chính xác cách phát âm một từ mà không phụ thuộc vào cách viết.</p>
                
                <h3>2. Tập trung vào các âm khó</h3>
                <p>Người Việt thường gặp khó khăn với một số âm tiếng Anh như /θ/ (th trong "think"), /ð/ (th trong "this"), /r/, /l/, /ʃ/ (sh), /ʒ/ (s trong "vision"). Hãy dành thời gian tập trung luyện các âm này.</p>
                
                <h3>3. Luyện tập nghe và bắt chước</h3>
                <p>Nghe nhiều và bắt chước cách phát âm của người bản ngữ là phương pháp hiệu quả. Sử dụng các video, podcast hoặc bài hát bằng tiếng Anh, sau đó lặp lại và cố gắng bắt chước âm điệu và nhịp điệu.</p>
                
                <h3>4. Chú ý đến trọng âm và ngữ điệu</h3>
                <p>Tiếng Anh là ngôn ngữ nhấn trọng âm, nghĩa là một số âm tiết được phát âm mạnh hơn trong từ (word stress) và một số từ được nhấn mạnh hơn trong câu (sentence stress). Ngữ điệu (intonation) cũng rất quan trọng và có thể thay đổi ý nghĩa của câu.</p>
                
                <h3>5. Sử dụng công cụ ghi âm</h3>
                <p>Ghi âm giọng nói của bạn và so sánh với phát âm chuẩn. Điều này giúp bạn nhận biết những âm cần cải thiện.</p>
                
                <h3>6. Luyện tập với tongue twisters</h3>
                <p>Tongue twisters (câu nói lưỡi) là những câu khó phát âm, giúp rèn luyện cơ miệng và lưỡi. Ví dụ: "She sells seashells by the seashore" hoặc "Red lorry, yellow lorry".</p>
                
                <h3>7. Học phát âm liên kết (linking)</h3>
                <p>Người bản ngữ thường nối các từ lại với nhau khi nói, tạo ra hiện tượng liên kết âm. Ví dụ: "What are you doing?" thường được phát âm là "Wha-ta-you doing?". Việc học cách liên kết âm giúp bạn nói tự nhiên hơn.</p>
                
                <h3>8. Tìm kiếm phản hồi</h3>
                <p>Nếu có thể, hãy tìm giáo viên hoặc bạn bè là người bản ngữ để nhận phản hồi về phát âm của bạn. Họ có thể chỉ ra những lỗi mà bạn không nhận ra.</p>
                
                <h3>9. Kiên trì luyện tập</h3>
                <p>Cải thiện phát âm là quá trình cần thời gian. Hãy dành ít nhất 15 phút mỗi ngày để luyện phát âm và kiên trì thực hiện.</p>
                
                <p>Nhớ rằng, mục tiêu không nhất thiết phải có giọng hoàn toàn như người bản ngữ, mà quan trọng hơn là phát âm rõ ràng và dễ hiểu trong giao tiếp. Hãy kiên trì và tận hưởng quá trình học!</p>`,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        const blogs = await db.collection('blogs').insertMany(blogsData);

        console.log(`Đã tạo ${blogs.insertedCount} blogs`);

        // 13. Tạo UserProgress
        console.log('Đang tạo tiến trình người dùng...');

        const userProgressData = [
            {
                user: refs.users.user3, // ngoc_anh
                unlockedGates: [refs.gates.gate0, refs.gates.gate1],
                unlockedStages: [refs.stages.stage0, refs.stages.stage1, refs.stages.stage2],
                experiencePoints: 150,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                user: refs.users.user4, // thanh_binh
                unlockedGates: [refs.gates.gate0, refs.gates.gate1, refs.gates.gate2],
                unlockedStages: [refs.stages.stage0, refs.stages.stage1, refs.stages.stage2, refs.stages.stage3, refs.stages.stage4],
                experiencePoints: 320,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                user: refs.users.user5, // minh_duc
                unlockedGates: [refs.gates.gate0],
                unlockedStages: [refs.stages.stage0],
                experiencePoints: 50,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                user: refs.users.user6, // thu_ha
                unlockedGates: [refs.gates.gate0, refs.gates.gate1, refs.gates.gate2, refs.gates.gate3],
                unlockedStages: [refs.stages.stage0, refs.stages.stage1, refs.stages.stage2, refs.stages.stage3, refs.stages.stage4, refs.stages.stage5],
                experiencePoints: 450,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        const userProgress = await db.collection('userprogresses').insertMany(userProgressData);

        console.log(`Đã tạo ${userProgress.insertedCount} tiến trình người dùng`);

        console.log('Hoàn thành tạo dữ liệu mẫu!');
    } catch (error) {
        console.error('Lỗi khi tạo dữ liệu mẫu:', error);
        throw error;
    }
};

// Chạy script
const runScript = async () => {
    try {
        console.log('Đang kết nối đến MongoDB...');
        await connectToDatabase();
        console.log('Đã kết nối, bắt đầu tạo dữ liệu mẫu...');

        await createSampleData();
        console.log('Hoàn thành!');
    } catch (error) {
        console.error('Lỗi:', error);
        console.error('Stack:', error.stack);
    } finally {
        console.log('Đóng kết nối...');
        setTimeout(() => {
            mongoose.connection.close();
            process.exit(0);
        }, 1000);
    }
};

// Chạy script khi file được thực thi trực tiếp
if (require.main === module) {
    runScript();
}

module.exports = { createSampleData, runScript }; 