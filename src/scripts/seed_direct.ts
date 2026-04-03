import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const TEACHER_ID = '69cd0630b527fd1a358'; // Verified Teacher ID

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in .env.local');
  process.exit(1);
}

// Inline Schemas for safe standalone seeding
const SubjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: '📚' },
  color: { type: String, default: '#3b82f6' },
  allowedContexts: { type: [String], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, default: 'General ICT' },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  type: { type: String, enum: ['lesson', 'activity', 'project'], default: 'lesson' },
  engage: { type: String, default: '' },
  explore: { type: String, default: '' },
  explain: { type: String, default: '' },
  elaborate: { type: Map, of: String, default: {} },
  evaluate: { type: String, default: '' },
  constructivistNote: { type: String, default: '' },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Subject = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
const Topic = mongoose.models.Topic || mongoose.model('Topic', TopicSchema);
const Module = mongoose.models.Module || mongoose.model('Module', ModuleSchema);

async function seed() {
  try {
    console.log('--- 🚀 Seeding Educational Content (Direct) ---');
    await mongoose.connect(MONGODB_URI as string);
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Clear Existing Data
    console.log('🧹 Clearing existing Subjects, Topics, and Modules...');
    await Subject.deleteMany({});
    await Topic.deleteMany({});
    await Module.deleteMany({});

    // 2. Create Subjects
    console.log('📂 Creating Subjects...');
    const digitalLiteracy = await Subject.create({
      title: 'Digital Literacy & Computer Science',
      description: 'Foundational concepts for the modern digital landscape in Nigeria. Scaffolding technical competence and critical thinking.',
      icon: '💻',
      color: '#10b981',
      allowedContexts: ['General', 'Junior Secondary'],
      createdBy: TEACHER_ID,
    });

    const coding = await Subject.create({
      title: 'Programming & Logic',
      description: 'The art of instructional design for computers. Building problem-solving capacity through code.',
      icon: '⌨️',
      color: '#6366f1',
      allowedContexts: ['General', 'Senior Secondary'],
      createdBy: TEACHER_ID,
    });

    // 3. Create Topics
    console.log('📚 Creating Topics...');
    const hardware = await Topic.create({
      title: 'The Physical Ecosystem: Hardware',
      description: 'Understanding the machines that power our digital lives.',
      category: 'Infrastructure',
      subjectId: digitalLiteracy._id,
      createdBy: TEACHER_ID,
    });

    const webSearch = await Topic.create({
      title: 'Information Research Skills',
      description: 'Navigating the global knowledge base effectively.',
      category: 'Research',
      subjectId: digitalLiteracy._id,
      createdBy: TEACHER_ID,
    });

    // 4. Create 5E Modules
    console.log('✨ Creating 5E Modules...');

    // Module 1: Input/Output
    await Module.create({
      title: 'The Binary Interface: I/O Devices',
      content: 'Exploring how we communicate with computers and how they respond to us.',
      topicId: hardware._id,
      type: 'activity',
      engage: 'Think about how you are reading this text right now. Which physical units are involved in bringing these words from the server to your screen?',
      explore: 'Try disconnecting your mouse and navigating with just the keyboard. What changes in your interaction model?',
      explain: 'Input devices (keyboards, scanners) convert physical actions into digital data. Output devices (monitors, printers) convert digital data into human-perceivable forms.',
      elaborate: {
        'Industrial': 'Sensors in oil pipelines act as input devices for safety systems.',
        'Creative': 'Graphic tablets allow artists to treat digital canvases like physical ones.'
      },
      evaluate: 'Design a single device that could replace both a keyboard and a mouse for a mobile workspace.',
      constructivistNote: 'Focus on the "conversion" aspect—from physical to digital and back.',
      questions: [{
        question: 'Is a Touchscreen an Input or Output device?',
        options: ['Input only', 'Output only', 'Both Input and Output', 'Neither'],
        correctAnswer: 2,
        explanation: 'A touchscreen senses your touch (Input) while displaying the interface (Output).'
      }],
      createdBy: TEACHER_ID,
    });

    // Module 2: Search Secrets
    await Module.create({
      title: 'Search Secrets: Boolean Mastery',
      content: 'Using logic to find exactly what you need in seconds.',
      topicId: webSearch._id,
      type: 'lesson',
      engage: 'Have you ever searched for a specific document and found millions of irrelevant results?',
      explore: 'Search for "Nigeria" and note the result count. Now search for "Nigeria AND History". What happened to the count?',
      explain: 'Boolean operators (AND, OR, NOT) are instructions for search engines to filter results precisely.',
      elaborate: {
        'Research': 'Use "site:.gov.ng" to find official Nigerian government statistics.',
        'Career': 'Find jobs using "(Developer OR Engineer) AND (Lagos OR remote)".'
      },
      evaluate: 'Compare the efficiency of two search strings for finding data on Nigerian tech unicorns.',
      constructivistNote: 'Scaffold the concept of "set theory" using visual Venn diagrams.',
      questions: [{
        question: 'Which operator expands your search the most?',
        options: ['AND', 'OR', 'NOT', 'NEAR'],
        correctAnswer: 1,
        explanation: 'OR includes results matching ANY of the terms, thus yielding more results than AND.'
      }],
      createdBy: TEACHER_ID,
    });

    console.log('🏁 Seeding Process Completed Successfully! 🏳️');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
}

seed();
