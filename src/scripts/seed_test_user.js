const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const seedTestUser = async () => {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI not found');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        // Define Schemas
        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
            name: String,
            email: String,
            passwordHash: String,
            role: { type: String, enum: ['teacher', 'student'], default: 'student' },
            isEmailVerified: { type: Boolean, default: false },
        }, { timestamps: true }));

        const Module = mongoose.models.Module || mongoose.model('Module', new mongoose.Schema({
            title: String,
        }));

        const UserProgress = mongoose.models.UserProgress || mongoose.model('UserProgress', new mongoose.Schema({
            userId: String,
            moduleId: mongoose.Schema.Types.ObjectId,
            status: { type: String, enum: ['locked', 'in-progress', 'completed'], default: 'locked' },
            score: { type: Number, default: 0 },
            currentStep: { type: Number, default: 0 },
            completedAt: Date,
        }, { timestamps: true }));

        // 1. Create/Update Test User
        const email = 'student@ictlearner.ng';
        const password = 'Password123!';
        const passwordHash = await bcrypt.hash(password, 10);

        console.log(`👤 Creating/Updating test user: ${email}...`);
        let user = await User.findOne({ email });
        if (user) {
            user.passwordHash = passwordHash;
            user.isEmailVerified = true;
            await user.save();
        } else {
            user = await User.create({
                name: 'Test Student',
                email: email,
                passwordHash: passwordHash,
                role: 'student',
                isEmailVerified: true
            });
        }
        
        console.log(`✅ User verified: ${user._id}`);

        // 2. Seed Progress
        console.log('📊 Seeding progress data...');
        const modules = await Module.find().limit(2);
        
        if (modules.length >= 1) {
            // Module 1: Completed
            await UserProgress.findOneAndUpdate(
                { userId: user._id.toString(), moduleId: modules[0]._id },
                { 
                    status: 'completed', 
                    score: 95, 
                    currentStep: 4, 
                    completedAt: new Date() 
                },
                { upsert: true, new: true }
            );
            console.log(`✓ Completed: ${modules[0].title}`);
        }

        if (modules.length >= 2) {
            // Module 2: In Progress
            await UserProgress.findOneAndUpdate(
                { userId: user._id.toString(), moduleId: modules[1]._id },
                { 
                    status: 'in-progress', 
                    score: 0, 
                    currentStep: 1 
                },
                { upsert: true, new: true }
            );
            console.log(`✓ In-Progress: ${modules[1].title}`);
        }

        console.log('🏁 Test user seeding successfully finished!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Seeding Error:', err);
        process.exit(1);
    }
};

seedTestUser();
