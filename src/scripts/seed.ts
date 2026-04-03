import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from '@/models/Subject';
import Topic from '@/models/Topic';
import Module from '@/models/Module';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const TEACHER_ID = '69cd0630b527fd1a358'; // Verified Teacher ID

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in .env.local');
  process.exit(1);
}

async function seed() {
  try {
    console.log('--- 🚀 Seeding Educational Content Cluster ---');
    await mongoose.connect(MONGODB_URI as string);
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Clear Existing Data (Optional - as per plan)
    console.log('🧹 Clearing existing subjects, topics, and modules...');
    await Subject.deleteMany({});
    await Topic.deleteMany({});
    await Module.deleteMany({});

    // 2. Create Subjects
    console.log('📂 Creating Subjects...');
    const digitalLiteracy = await Subject.create({
      title: 'Digital Literacy & Computer Studies',
      description: 'Foundational concepts for the modern digital landscape in Nigeria. Scaffolding technical competence and critical thinking.',
      icon: '💻',
      color: '#10b981',
      allowedContexts: ['General', 'Junior Secondary'],
      createdBy: TEACHER_ID,
    });

    const cyberSecurity = await Subject.create({
      title: 'Cybersecurity & Digital Ethics',
      description: 'Navigating the risks and responsibilities of our hyper-connected world. Constructing safe digital identities.',
      icon: '🛡️',
      color: '#6366f1',
      allowedContexts: ['General', 'Senior Secondary'],
      createdBy: TEACHER_ID,
    });

    // 3. Create Topics
    console.log('📚 Creating Topics...');
    const searchSkills = await Topic.create({
      title: 'Information Research & Analysis',
      description: 'Mastering the art of finding, evaluating, and synthesizing information in a digital world.',
      category: 'Research',
      subjectId: digitalLiteracy._id,
      createdBy: TEACHER_ID,
    });

    const hardwareFund = await Topic.create({
      title: 'Computer Hardware Ecosystems',
      description: 'Understanding the physical components that power our digital experiences.',
      category: 'Hardware',
      subjectId: digitalLiteracy._id,
      createdBy: TEACHER_ID,
    });

    const cyberEthics = await Topic.create({
      title: 'Digital Ethics & Safety',
      description: 'Navigating the responsibilities and risks of the digital world.',
      category: 'Security',
      subjectId: cyberSecurity._id,
      createdBy: TEACHER_ID,
    });

    // 4. Create Modules (5E Model)
    console.log('✨ Creating 5E Modules...');

    // Module A: Web Searching
    await Module.create({
      title: 'Effective Web Searching',
      content: 'Mastering search engines and Boolean operators for academic and professional research.',
      topicId: searchSkills._id,
      type: 'lesson',
      engage: 'Have you ever tried to find a specific local recipe online but ended up overwhelmed by irrelevant results from other countries? This is where professional searching starts.',
      explore: 'Try searching for "Jollof Rice" and then "Nigerian Jollof Rice". Compare the number of results and the relevance of the first page. What patterns do you notice?',
      explain: 'Search engines use algorithms to rank pages. By using Boolean operators like AND, OR, and NOT, you can direct these algorithms. For example, "Jollof AND Nigeria" ensures both terms appear.',
      elaborate: new Map([
        ['Academic', 'When researching Nigerian history, use "site:.gov.ng" to find official government publications.'],
        ['Career', 'Recruiters often use Boolean strings to find specific skills on LinkedIn. This skill makes you more discoverable.'],
      ]),
      evaluate: 'Compare two search strings for finding data on Nigerian tech startups. Which one is more efficient and why?',
      constructivistNote: 'Encourage students to build their own "search library" of effective queries for their specific interests.',
      questions: [
        {
          question: 'Which Boolean operator would you use to find results containing "Lagos" but excluding results about the movie "Lagos"?',
          options: ['AND', 'OR', 'NOT', 'NEAR'],
          correctAnswer: 2,
          explanation: 'The NOT operator (or minus sign in some engines) explicitly excludes terms from your search results.',
        },
      ],
      createdBy: TEACHER_ID,
    });

    // Module B: Input/Output
    await Module.create({
      title: 'The Binary Interface: I/O Devices',
      content: 'Exploring how we communicate with computers and how they respond to us.',
      topicId: hardwareFund._id,
      type: 'activity',
      engage: 'Think about how you are reading this text right now. Which physical components are involved in bringing these words from the server to your eyes?',
      explore: 'List all the devices connected to your current terminal. Classify them into "Input" (sending data) or "Output" (receiving data). Is there anything that does both?',
      explain: 'Input devices like keyboards and mice convert human actions into digital signals. Output devices like monitors and speakers convert that digital data back into human-perceivable forms.',
      elaborate: new Map([
        ['Robotics', 'In automation, sensors act as input devices for a robot, while motors (actuators) act as output devices.'],
        ['Accessibility', 'How would a visually impaired person use an input/output device differently? Consider braille displays and screen readers.'],
      ]),
      evaluate: 'Propose a new type of input device that would make using a computer easier for children in rural classrooms.',
      constructivistNote: 'Focus on the "conversion" aspect—from physical to digital and back again.',
      questions: [
        {
          question: 'Is a Touchscreen an Input or Output device?',
          options: ['Input only', 'Output only', 'Both Input and Output', 'Neither'],
          correctAnswer: 2,
          explanation: 'A touchscreen is a sensing surface (Input) overlaid on top of a display (Output), performing both functions simultaneously.',
        },
      ],
      createdBy: TEACHER_ID,
    });

    // Module C: Digital Footprints
    await Module.create({
      title: 'Digital Shadows & Footprints',
      content: 'Evaluating the permanent trail we leave in digital environments and constructing a responsible online identity.',
      topicId: cyberEthics._id,
      type: 'project',
      engage: 'Did you know that a "deleted" post can sometimes be found years later? We call this our digital footprint.',
      explore: 'Try searching for your own name or a popular public figure. What different sources of information appear? How much of it was shared by them versus others?',
      explain: 'A digital footprint is the collection of all traces you leave online. It can be passive (data collected without you knowing) or active (what you post).',
      elaborate: new Map([
        ['Ethics', 'How would you feel if a future employer saw your current social media posts? Consider the importance of digital reputation.'],
        ['Safety', 'Privacy settings are your first line of defense, but the best protection is being mindful of what you share.'],
      ]),
      evaluate: 'Design a "Digital Clean-up" plan for a student who wants to improve their online reputation before applying for university.',
      constructivistNote: 'Encourage students to view their digital identity as a professional portfolio that they are actively building.',
      questions: [
        {
          question: 'What is the most effective way to manage your digital footprint?',
          options: ['Deleting all accounts', 'Using a fake name', 'Mindful sharing and privacy hygiene', 'Ignoring it'],
          correctAnswer: 2,
          explanation: 'Mindful sharing and regular privacy checks are the most sustainable ways to build a positive digital presence.',
        },
      ],
      createdBy: TEACHER_ID,
    });

    console.log('🏁 Seeding Completed Successfully! 🏳️');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
}

seed();
