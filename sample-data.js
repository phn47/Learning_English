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
        await User.deleteMany({});
        await Journey.deleteMany({});
        await Gate.deleteMany({});
        await Stage.deleteMany({});
        await Grammar.deleteMany({});
        await GrammarExercise.deleteMany({});
        await Pronunciation.deleteMany({});
        await PronunciationExercise.deleteMany({});
        await VocabularyExercise.deleteMany({});
        await Blog.deleteMany({});
        await Flashcard.deleteMany({});
        await FlashcardList.deleteMany({});
        await UserProgress.deleteMany({});
        console.log('Đã xóa dữ liệu cũ');

        // 1. Tạo users
        console.log('Đang tạo người dùng...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        const adminUser = new User({
            email: 'admin@example.com',
            password: hashedPassword,
            fullName: 'Quản Trị Viên',
            role: 'admin',
            avatar: '/static/images/avatars/admin-avatar.png'
        });

        const teacher = new User({
            email: 'teacher@example.com',
            password: hashedPassword,
            fullName: 'Nguyễn Thị Hương',
            role: 'admin',
            avatar: '/static/images/avatars/teacher-avatar.png'
        });

        const student1 = new User({
            email: 'student1@example.com',
            password: hashedPassword,
            fullName: 'Trần Văn An',
            role: 'user',
            avatar: '/static/images/avatars/student1-avatar.png'
        });

        const student2 = new User({
            email: 'student2@example.com',
            password: hashedPassword,
            fullName: 'Lê Thị Bình',
            role: 'user',
            avatar: '/static/images/avatars/student2-avatar.png'
        });

        const savedAdmin = await adminUser.save();
        const savedTeacher = await teacher.save();
        const savedStudent1 = await student1.save();
        const savedStudent2 = await student2.save();
        console.log('Đã tạo người dùng mẫu');

        // 2. Tạo journeys
        console.log('Đang tạo hành trình học tập...');
        const beginnerJourney = new Journey({
            title: 'Tiếng Anh Cơ Bản',
            description: 'Hành trình học tiếng Anh từ đầu dành cho người mới bắt đầu. Khóa học này giúp bạn xây dựng nền tảng vững chắc với các từ vựng và ngữ pháp cơ bản nhất.',
            level: 'beginner',
            order: 1,
            isActive: true
        });

        const intermediateJourney = new Journey({
            title: 'Tiếng Anh Trung Cấp',
            description: 'Nâng cao kỹ năng tiếng Anh của bạn với các chủ đề phức tạp hơn. Khóa học này tập trung vào giao tiếp hàng ngày và các tình huống thực tế.',
            level: 'intermediate',
            order: 2,
            isActive: true
        });

        const advancedJourney = new Journey({
            title: 'Tiếng Anh Nâng Cao',
            description: 'Hoàn thiện kỹ năng tiếng Anh với các chủ đề chuyên sâu và học cách diễn đạt như người bản xứ. Khóa học này giúp bạn đạt được trình độ gần như người bản ngữ.',
            level: 'advanced',
            order: 3,
            isActive: false
        });

        const savedBeginnerJourney = await beginnerJourney.save();
        const savedIntermediateJourney = await intermediateJourney.save();
        const savedAdvancedJourney = await advancedJourney.save();
        console.log('Đã tạo hành trình học tập');

        // 3. Tạo gates cho Beginner Journey
        console.log('Đang tạo cổng học tập...');
        const introductionGate = new Gate({
            title: 'Giới Thiệu Tiếng Anh',
            description: 'Làm quen với ngôn ngữ tiếng Anh thông qua các bài học đơn giản và thực tế.',
            journey: savedBeginnerJourney._id,
            order: 1,
            isActive: true
        });

        const dailyConversationGate = new Gate({
            title: 'Giao Tiếp Hàng Ngày',
            description: 'Học cách giao tiếp trong các tình huống hàng ngày như chào hỏi, giới thiệu bản thân, và hỏi đường.',
            journey: savedBeginnerJourney._id,
            order: 2,
            isActive: true
        });

        const basicGrammarGate = new Gate({
            title: 'Ngữ Pháp Cơ Bản',
            description: 'Học các cấu trúc ngữ pháp cơ bản cần thiết cho việc giao tiếp hàng ngày.',
            journey: savedBeginnerJourney._id,
            order: 3,
            isActive: true
        });

        const savedIntroGate = await introductionGate.save();
        const savedDailyConvoGate = await dailyConversationGate.save();
        const savedBasicGrammarGate = await basicGrammarGate.save();
        console.log('Đã tạo cổng học tập');

        // Cập nhật journey với gates
        savedBeginnerJourney.gates = [savedIntroGate._id, savedDailyConvoGate._id, savedBasicGrammarGate._id];
        await savedBeginnerJourney.save();

        // 4. Tạo stages cho Introduction Gate
        console.log('Đang tạo giai đoạn học tập...');
        const alphabetStage = new Stage({
            title: 'Bảng Chữ Cái',
            description: 'Học bảng chữ cái tiếng Anh và cách phát âm từng chữ cái.',
            gate: savedIntroGate._id,
            order: 1,
            type: 'pronunciation',
            isActive: true
        });

        const greetingsStage = new Stage({
            title: 'Chào Hỏi',
            description: 'Học cách chào hỏi trong các tình huống khác nhau.',
            gate: savedIntroGate._id,
            order: 2,
            type: 'vocabulary',
            isActive: true
        });

        const toBeVerbStage = new Stage({
            title: 'Động Từ To Be',
            description: 'Học cách sử dụng động từ "to be" (am, is, are) trong các câu đơn giản.',
            gate: savedIntroGate._id,
            order: 3,
            type: 'grammar',
            isActive: true
        });

        const savedAlphabetStage = await alphabetStage.save();
        const savedGreetingsStage = await greetingsStage.save();
        const savedToBeVerbStage = await toBeVerbStage.save();
        console.log('Đã tạo giai đoạn học tập');

        // Cập nhật gate với stages
        savedIntroGate.stages = [savedAlphabetStage._id, savedGreetingsStage._id, savedToBeVerbStage._id];
        await savedIntroGate.save();

        // 5. Tạo grammar cho To Be Verb Stage
        console.log('Đang tạo bài học ngữ pháp...');
        const toBeGrammar = new Grammar({
            title: 'Động Từ To Be',
            explanation: 'Động từ "to be" (am, is, are) được sử dụng để mô tả danh tính hoặc trạng thái của một người hoặc vật. Chúng ta sử dụng "am" với ngôi thứ nhất số ít (I), "is" với ngôi thứ ba số ít (he, she, it), và "are" với số nhiều và ngôi thứ hai (you, we, they).',
            examples: [
                'I am a student.',
                'She is happy.',
                'They are from Vietnam.',
                'He is tall.',
                'We are in the classroom.',
                'You are my friend.'
            ],
            stage: savedToBeVerbStage._id
        });

        const savedToBeGrammar = await toBeGrammar.save();
        console.log('Đã tạo bài học ngữ pháp');

        // 6. Tạo grammar exercises cho To Be Grammar
        console.log('Đang tạo bài tập ngữ pháp...');
        const grammarExercise1 = new GrammarExercise({
            question: 'Complete the sentence: She ____ a doctor.',
            options: ['am', 'is', 'are', 'be'],
            correctAnswer: 'is',
            explanation: 'We use "is" with the third-person singular (she, he, it).',
            grammar: savedToBeGrammar._id,
            type: 'multiple-choice'
        });

        const grammarExercise2 = new GrammarExercise({
            question: 'Complete the sentence: I ____ a student.',
            options: ['am', 'is', 'are', 'be'],
            correctAnswer: 'am',
            explanation: 'We use "am" with the first-person singular (I).',
            grammar: savedToBeGrammar._id,
            type: 'multiple-choice'
        });

        const grammarExercise3 = new GrammarExercise({
            question: 'Complete the sentence: They ____ from Vietnam.',
            options: ['am', 'is', 'are', 'be'],
            correctAnswer: 'are',
            explanation: 'We use "are" with plural subjects (they, we) and the second person (you).',
            grammar: savedToBeGrammar._id,
            type: 'multiple-choice'
        });

        const grammarExercise4 = new GrammarExercise({
            question: 'Rewrite the sentence: He is tall. -> ____',
            correctAnswer: 'Is he tall?',
            explanation: 'To form a yes/no question with "to be", we move the verb before the subject.',
            grammar: savedToBeGrammar._id,
            type: 'rewrite'
        });

        const savedGrammarExercise1 = await grammarExercise1.save();
        const savedGrammarExercise2 = await grammarExercise2.save();
        const savedGrammarExercise3 = await grammarExercise3.save();
        const savedGrammarExercise4 = await grammarExercise4.save();
        console.log('Đã tạo bài tập ngữ pháp');

        // 7. Tạo pronunciation cho Alphabet Stage
        console.log('Đang tạo bài học phát âm...');
        const pronunciationA = new Pronunciation({
            word: 'A',
            phonetic: '/eɪ/',
            audioUrl: '/static/audio/alphabet/A.mp3',
            stage: savedAlphabetStage._id
        });

        const pronunciationB = new Pronunciation({
            word: 'B',
            phonetic: '/biː/',
            audioUrl: '/static/audio/alphabet/B.mp3',
            stage: savedAlphabetStage._id
        });

        const pronunciationC = new Pronunciation({
            word: 'C',
            phonetic: '/siː/',
            audioUrl: '/static/audio/alphabet/C.mp3',
            stage: savedAlphabetStage._id
        });

        const savedPronunciationA = await pronunciationA.save();
        const savedPronunciationB = await pronunciationB.save();
        const savedPronunciationC = await pronunciationC.save();
        console.log('Đã tạo bài học phát âm');

        // 8. Tạo pronunciation exercises
        console.log('Đang tạo bài tập phát âm...');
        const pronunciationExercise1 = new PronunciationExercise({
            word: 'Apple',
            audioUrl: '/static/audio/words/apple.mp3',
            correctPronunciation: '/ˈæp.əl/',
            hints: ['Bắt đầu với âm /æ/ như trong "cat"', 'Kết thúc với âm /əl/'],
            pronunciation: savedPronunciationA._id
        });

        const pronunciationExercise2 = new PronunciationExercise({
            word: 'Banana',
            audioUrl: '/static/audio/words/banana.mp3',
            correctPronunciation: '/bəˈnɑː.nə/',
            hints: ['Nhấn âm tiết thứ hai "na"', 'Âm /ɑː/ kéo dài trong tiết nhấn'],
            pronunciation: savedPronunciationB._id
        });

        const savedPronunciationExercise1 = await pronunciationExercise1.save();
        const savedPronunciationExercise2 = await pronunciationExercise2.save();
        console.log('Đã tạo bài tập phát âm');

        // 9. Tạo vocabulary exercises cho Greetings Stage
        console.log('Đang tạo bài tập từ vựng...');
        const vocabularyExercise1 = new VocabularyExercise({
            word: 'Hello',
            meaning: 'Xin chào (cách chào lịch sự, dùng trong mọi tình huống)',
            example: 'Hello, my name is John.',
            options: ['Xin chào', 'Tạm biệt', 'Cảm ơn', 'Xin lỗi'],
            correctAnswer: 'Xin chào',
            stage: savedGreetingsStage._id
        });

        const vocabularyExercise2 = new VocabularyExercise({
            word: 'Good morning',
            meaning: 'Chào buổi sáng (dùng từ sáng đến trưa)',
            example: 'Good morning! How are you today?',
            options: ['Chào buổi sáng', 'Chào buổi chiều', 'Chào buổi tối', 'Chúc ngủ ngon'],
            correctAnswer: 'Chào buổi sáng',
            stage: savedGreetingsStage._id
        });

        const vocabularyExercise3 = new VocabularyExercise({
            word: 'Goodbye',
            meaning: 'Tạm biệt (cách chào tạm biệt lịch sự)',
            example: 'Goodbye! See you tomorrow.',
            options: ['Xin chào', 'Tạm biệt', 'Cảm ơn', 'Chúc may mắn'],
            correctAnswer: 'Tạm biệt',
            stage: savedGreetingsStage._id
        });

        const savedVocabularyExercise1 = await vocabularyExercise1.save();
        const savedVocabularyExercise2 = await vocabularyExercise2.save();
        const savedVocabularyExercise3 = await vocabularyExercise3.save();
        console.log('Đã tạo bài tập từ vựng');

        // 10. Tạo flashcard lists
        console.log('Đang tạo danh sách thẻ ghi nhớ...');
        const greetingsFlashcardList = new FlashcardList({
            title: 'Từ Vựng Chào Hỏi',
            description: 'Các từ và cụm từ thông dụng để chào hỏi trong tiếng Anh.',
            user: savedStudent1._id
        });

        const numbersFlashcardList = new FlashcardList({
            title: 'Số Đếm Tiếng Anh',
            description: 'Các số từ 1-20 trong tiếng Anh.',
            user: savedStudent1._id
        });

        const savedGreetingsFlashcardList = await greetingsFlashcardList.save();
        const savedNumbersFlashcardList = await numbersFlashcardList.save();
        console.log('Đã tạo danh sách thẻ ghi nhớ');

        // 11. Tạo flashcards
        console.log('Đang tạo thẻ ghi nhớ...');
        const helloFlashcard = new Flashcard({
            word: 'Hello',
            meaning: 'Xin chào',
            example: 'Hello, how are you?',
            imageUrl: '/static/images/flashcards/hello.jpg',
            list: savedGreetingsFlashcardList._id
        });

        const goodbyeFlashcard = new Flashcard({
            word: 'Goodbye',
            meaning: 'Tạm biệt',
            example: 'Goodbye, see you tomorrow!',
            imageUrl: '/static/images/flashcards/goodbye.jpg',
            list: savedGreetingsFlashcardList._id
        });

        const thankyouFlashcard = new Flashcard({
            word: 'Thank you',
            meaning: 'Cảm ơn',
            example: 'Thank you for your help.',
            imageUrl: '/static/images/flashcards/thankyou.jpg',
            list: savedGreetingsFlashcardList._id
        });

        const savedHelloFlashcard = await helloFlashcard.save();
        const savedGoodbyeFlashcard = await goodbyeFlashcard.save();
        const savedThankyouFlashcard = await thankyouFlashcard.save();
        console.log('Đã tạo thẻ ghi nhớ');

        // Cập nhật flashcard list với cards
        savedGreetingsFlashcardList.cards = [
            savedHelloFlashcard._id,
            savedGoodbyeFlashcard._id,
            savedThankyouFlashcard._id
        ];
        await savedGreetingsFlashcardList.save();

        // 12. Tạo user progress
        console.log('Đang tạo tiến trình học tập...');
        const userProgress1 = new UserProgress({
            user: savedStudent1._id,
            journey: savedBeginnerJourney._id,
            gate: savedIntroGate._id,
            stage: savedAlphabetStage._id,
            currentStage: savedAlphabetStage._id,
            completedExercises: [
                {
                    exerciseId: savedPronunciationExercise1._id,
                    type: 'pronunciation',
                    score: 85,
                    completedAt: new Date()
                }
            ],
            progress: 10
        });

        const userProgress2 = new UserProgress({
            user: savedStudent2._id,
            journey: savedBeginnerJourney._id,
            gate: savedIntroGate._id,
            stage: savedGreetingsStage._id,
            currentStage: savedGreetingsStage._id,
            completedExercises: [
                {
                    exerciseId: savedVocabularyExercise1._id,
                    type: 'vocabulary',
                    score: 90,
                    completedAt: new Date()
                },
                {
                    exerciseId: savedVocabularyExercise2._id,
                    type: 'vocabulary',
                    score: 75,
                    completedAt: new Date()
                }
            ],
            progress: 25
        });

        const savedUserProgress1 = await userProgress1.save();
        const savedUserProgress2 = await userProgress2.save();
        console.log('Đã tạo tiến trình học tập');

        // 13. Tạo blogs
        console.log('Đang tạo bài viết blog...');
        const blog1 = new Blog({
            title: 'Làm Thế Nào Để Học Tiếng Anh Hiệu Quả?',
            content: `
# Làm Thế Nào Để Học Tiếng Anh Hiệu Quả?

Học tiếng Anh là một hành trình đầy thử thách nhưng vô cùng bổ ích. Dưới đây là một số phương pháp giúp bạn học tiếng Anh hiệu quả hơn:

## 1. Học từ vựng trong ngữ cảnh

Thay vì học từng từ riêng lẻ, hãy học từ vựng trong câu và ngữ cảnh cụ thể. Điều này giúp bạn hiểu rõ cách sử dụng từ và dễ dàng ghi nhớ hơn.

## 2. Luyện nghe mỗi ngày

Nghe tiếng Anh mỗi ngày là cách tuyệt vời để cải thiện kỹ năng nghe và phát âm. Bạn có thể nghe podcast, xem phim, hoặc nghe nhạc tiếng Anh.

## 3. Thực hành nói thường xuyên

Đừng sợ mắc lỗi! Càng nói nhiều, bạn càng tiến bộ nhanh. Hãy tìm bạn học hoặc tham gia các nhóm học tiếng Anh để thực hành nói.

## 4. Đọc sách tiếng Anh

Đọc sách tiếng Anh giúp mở rộng vốn từ vựng và cải thiện ngữ pháp. Hãy bắt đầu với những cuốn sách đơn giản và tăng dần độ khó.

## 5. Học mỗi ngày

Học đều đặn mỗi ngày, dù chỉ 15-30 phút, sẽ hiệu quả hơn nhiều so với học dồn một lúc nhiều giờ. Sự nhất quán là chìa khóa để thành công.
`,
            author: savedTeacher._id,
            tags: ['tips', 'learning', 'beginners', 'study-methods'],
            imageUrl: '/static/images/blogs/effective-learning.jpg'
        });

        const blog2 = new Blog({
            title: '5 Cách Cải Thiện Phát Âm Tiếng Anh',
            content: `
# 5 Cách Cải Thiện Phát Âm Tiếng Anh

Phát âm chuẩn là một trong những yếu tố quan trọng nhất để giao tiếp tiếng Anh hiệu quả. Dưới đây là 5 cách giúp bạn cải thiện phát âm:

## 1. Nghe và bắt chước

Nghe người bản xứ nói và cố gắng bắt chước cách họ phát âm. Bạn có thể sử dụng các ứng dụng học tiếng Anh, podcast, hoặc video trên YouTube.

## 2. Học biểu đồ phát âm IPA

Biểu đồ IPA (International Phonetic Alphabet) giúp bạn hiểu cách phát âm chính xác từng âm tiết trong tiếng Anh. Điều này đặc biệt hữu ích cho những âm không có trong tiếng Việt.

## 3. Ghi âm và so sánh

Ghi âm giọng nói của bạn và so sánh với người bản xứ. Điều này giúp bạn nhận ra những khác biệt và tập trung vào các lỗi phát âm cụ thể.

## 4. Đọc to

Đọc to giúp bạn thực hành phát âm và nghe thấy giọng của chính mình. Hãy chọn những đoạn văn ngắn và đọc to mỗi ngày.

## 5. Tập trung vào nhịp điệu và ngữ điệu

Tiếng Anh có nhịp điệu và ngữ điệu đặc trưng. Việc học cách nhấn âm đúng và theo nhịp điệu tự nhiên sẽ giúp phát âm của bạn tự nhiên hơn.
`,
            author: savedTeacher._id,
            tags: ['pronunciation', 'speaking', 'tips'],
            imageUrl: '/static/images/blogs/pronunciation-tips.jpg'
        });

        const savedBlog1 = await blog1.save();
        const savedBlog2 = await blog2.save();
        console.log('Đã tạo bài viết blog');

        console.log('Đã tạo dữ liệu mẫu thành công!');

    } catch (error) {
        console.error('Lỗi khi tạo dữ liệu mẫu:', error);
        console.error('Stack:', error.stack);
    }
};

// Chạy script
const runScript = async () => {
    try {
        console.log('Đang kết nối đến MongoDB...');
        const connection = await connectToDatabase();
        console.log('Đã kết nối, bắt đầu tạo dữ liệu mẫu...');

        if (connection) {
            await createSampleData();
            console.log('Hoàn thành!');
        }
    } catch (error) {
        console.error('Lỗi kết nối:', error);
        console.error('Stack:', error.stack);
    } finally {
        console.log('Đóng kết nối...');
        setTimeout(() => process.exit(0), 1000);
    }
};

runScript(); 