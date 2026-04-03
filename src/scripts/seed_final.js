const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const TEACHER_ID = '6a1cd0630b527fd1a358'; // Verified Teacher ID (ensured length 24 if needed? No, user provided it)
// Actually Teacher ID in MongoDB must be 24-char hex or something. Let me check the earlier query.
// Previous query output: {"_id":"67cd0630b527fd1a35868c22", ... } 
// Ah, the output was truncated. Let me use a valid 24-char hex from common patterns or re-query.
// I'll re-query the ID more carefully.

const seedData = async () => {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI not found');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        // Find a real teacher ID if not already known
        const User = mongoose.model('User', new mongoose.Schema({ role: String }));
        const teacher = await User.findOne({ role: 'teacher' });
        
        if (!teacher) {
            console.error('❌ No teacher account found to attribute content to.');
            process.exit(1);
        }
        
        const teacherId = teacher._id;
        console.log(`👤 Attributing content to teacher: ${teacher.email || teacherId}`);

        // Define Schemas
        const Subject = mongoose.models.Subject || mongoose.model('Subject', new mongoose.Schema({
            title: String,
            description: String,
            icon: String,
            color: String,
            allowedContexts: [String],
            createdBy: mongoose.Schema.Types.ObjectId,
        }, { timestamps: true }));

        const Topic = mongoose.models.Topic || mongoose.model('Topic', new mongoose.Schema({
            title: String,
            description: String,
            category: String,
            subjectId: mongoose.Schema.Types.ObjectId,
            createdBy: mongoose.Schema.Types.ObjectId,
        }, { timestamps: true }));

        const Module = mongoose.models.Module || mongoose.model('Module', new mongoose.Schema({
            title: String,
            content: String,
            topicId: mongoose.Schema.Types.ObjectId,
            type: String,
            engage: String,
            explore: String,
            explain: String,
            elaborate: Map,
            evaluate: String,
            constructivistNote: String,
            questions: Array,
            createdBy: mongoose.Schema.Types.ObjectId,
        }, { timestamps: true }));

        // 1. Clear Data
        console.log('🧹 Clearing Subjects, Topics, and Modules...');
        await Subject.deleteMany({});
        await Topic.deleteMany({});
        await Module.deleteMany({});

        // 2. Create Subject
        console.log('📂 Creating "Digital Literacy" Subject...');
        const subject = await Subject.create({
            title: 'Digital Literacy & Computer Science',
            description: 'Foundational concepts for the modern digital landscape in Nigeria. Scaffolding technical competence.',
            icon: '💻',
            color: '#10b981',
            allowedContexts: ['General'],
            createdBy: teacherId
        });

        // 3. Create Topic
        console.log('📚 Creating "Hardware Fundamentals" Topic...');
        const topic = await Topic.create({
            title: 'Hardware Fundamentals',
            description: 'Unlocking the power of computer components.',
            category: 'Infrastructure',
            subjectId: subject._id,
            createdBy: teacherId
        });

        // 4. Create Modules
        console.log('✨ Creating 5E Modules...');
        
        await Module.create({
            title: 'The Binary Interface: I/O Devices',
            content: 'Exploring how we communicate with computers.',
            topicId: topic._id,
            type: 'lesson',
            engage: 'How are you interacting with this dashboard right now?',
            explore: 'Disconnect your mouse and try to navigate. What happens?',
            explain: 'Input devices convert physical actions into digital data. Output devices do the reverse.',
            elaborate: new Map([['Academic', 'Oil rigs use sensors as input to maintain safety.']]),
            evaluate: 'Design a device that combines a keyboard and a mouse.',
            constructivistNote: 'Focus on the "conversion" aspect.',
            questions: [{
                question: 'Is a Touchscreen Input or Output?',
                options: ['Input', 'Output', 'Both', 'Neither'],
                correctAnswer: 2,
                explanation: 'A touchscreen senses touch (Input) and displays pixels (Output).'
            }],
            createdBy: teacherId
        });

        await Module.create({
            title: 'Digital Research & Online Safety',
            content: 'Navigating the global knowledge base safely.',
            topicId: topic._id, // Reusing topic for demo
            type: 'activity',
            engage: 'Ever searched for something and found millions of irrelevant results?',
            explore: 'Compare results for "Nigeria" vs "Nigeria AND History".',
            explain: 'Boolean operators filter search results precisely.',
            elaborate: new Map([['Legal', 'Search .gov.ng for official laws.']]),
            evaluate: 'Create a Boolean string to find tech jobs in Lagos.',
            constructivistNote: 'Scaffold set theory concepts.',
            questions: [{
                question: 'Which operator expanding the search?',
                options: ['AND', 'OR', 'NOT', 'NEAR'],
                correctAnswer: 1,
                explanation: 'OR includes any result matching either term.'
            }],
            createdBy: teacherId
        });

        console.log('🏁 Seeding successfully finished! 🏳️');
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Seeding Error:', err);
        process.exit(1);
    }
};

seedData();
