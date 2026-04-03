const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://Mubarak:ddZFO2wQQWQV6DMi@dml-cluster-shard-00-00.3j5lw.mongodb.net:27017,dml-cluster-shard-00-01.3j5lw.mongodb.net:27017,dml-cluster-shard-00-02.3j5lw.mongodb.net:27017/ict-learner-nigeria?ssl=true&replicaSet=atlas-12fagn-shard-0&authSource=admin&appName=dml-cluster';
const TEACHER_ID = new mongoose.Types.ObjectId('69cd0630b527fd1a358fe69c');

async function seed() {
  try {
    console.log('--- 🚀 Seeding Educational Content Cluster (Standardized Mode) ---');
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;

    console.log('🧹 Clearing existing collections...');
    // Clear the new standardized collections
    await db.collection('subjects').deleteMany({});
    await db.collection('topics').deleteMany({});
    await db.collection('modules').deleteMany({});
    
    // Also clear the old namespaced collections just in case
    await db.collection('ict-learner-nigeria').deleteMany({}); 
    await db.collection('ict-learner-nigeria-topics').deleteMany({});
    await db.collection('ict-learner-nigeria-modules').deleteMany({});

    console.log('📂 Creating Subjects...');
    const digitalLiteracyId = new mongoose.Types.ObjectId();
    await db.collection('subjects').insertOne({
      _id: digitalLiteracyId,
      title: 'Digital Literacy & Computer Studies',
      description: 'Foundational concepts for the modern digital landscape in Nigeria. Scaffolding technical competence and critical thinking.',
      icon: '💻',
      color: '#10b981',
      allowedContexts: ['General', 'Junior Secondary'],
      createdBy: TEACHER_ID,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const cyberSecurityId = new mongoose.Types.ObjectId();
    await db.collection('subjects').insertOne({
      _id: cyberSecurityId,
      title: 'Cybersecurity & Digital Ethics',
      description: 'Navigating the risks and responsibilities of our hyper-connected world. Constructing safe digital identities.',
      icon: '🛡️',
      color: '#6366f1',
      allowedContexts: ['General', 'Senior Secondary'],
      createdBy: TEACHER_ID,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('📚 Creating Topics...');
    const searchSkillsId = new mongoose.Types.ObjectId();
    await db.collection('topics').insertOne({
      _id: searchSkillsId,
      title: 'Information Research & Analysis',
      description: 'Mastering the art of finding, evaluating, and synthesizing information in a digital world.',
      category: 'Research',
      subjectId: digitalLiteracyId,
      createdBy: TEACHER_ID,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const hardwareFundId = new mongoose.Types.ObjectId();
    await db.collection('topics').insertOne({
      _id: hardwareFundId,
      title: 'Computer Hardware Ecosystems',
      description: 'Understanding the physical components that power our digital experiences.',
      category: 'Hardware',
      subjectId: digitalLiteracyId,
      createdBy: TEACHER_ID,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const cyberEthicsId = new mongoose.Types.ObjectId();
    await db.collection('topics').insertOne({
      _id: cyberEthicsId,
      title: 'Digital Ethics & Safety',
      description: 'Navigating the responsibilities and risks of the digital world.',
      category: 'Security',
      subjectId: cyberSecurityId,
      createdBy: TEACHER_ID,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✨ Creating 5E Modules...');
    
    // Module A: Web Searching
    await db.collection('modules').insertOne({
      title: 'Effective Web Searching',
      content: 'Mastering search engines and Boolean operators for academic and professional research.',
      topicId: searchSkillsId,
      type: 'lesson',
      engage: 'Have you ever tried to find a specific local recipe online but ended up overwhelmed by irrelevant results from other countries? This is where professional searching starts.',
      explore: 'Try searching for "Jollof Rice" and then "Nigerian Jollof Rice". Compare the number of results and the relevance of the first page. What patterns do you notice?',
      explain: 'Search engines use algorithms to rank pages. By using Boolean operators like AND, OR, and NOT, you can direct these algorithms. For example, "Jollof AND Nigeria" ensures both terms appear.',
      elaborate: {
        'Academic': 'When researching Nigerian history, use "site:.gov.ng" to find official government publications.',
        'Career': 'Recruiters often use Boolean strings to find specific skills on LinkedIn. This skill makes you more discoverable.'
      },
      evaluate: 'Compare two search strings for finding data on Nigerian tech startups. Which one is more efficient and why?',
      constructivistNote: 'Encourage students to build their own "search library" of effective queries for their specific interests.',
      questions: [
        {
          question: 'Which Boolean operator would you use to find results containing "Lagos" but excluding results about the movie "Lagos"?',
          options: ['AND', 'OR', 'NOT', 'NEAR'],
          correctAnswer: 2,
          explanation: 'The NOT operator (or minus sign in some engines) explicitly excludes terms from your search results.'
        }
      ],
      createdBy: TEACHER_ID,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Module B: I/O Devices
    await db.collection('modules').insertOne({
      title: 'The Binary Interface: I/O Devices',
      content: 'Exploring how we communicate with computers and how they respond to us. This covers basic peripherals to advanced biometric scanners.',
      topicId: hardwareFundId,
      type: 'activity',
      engage: 'Have you ever tried to type on a screen with water on your fingers? Why does it fail? What physical bridges connect our chaotic human world to the perfectly structured digital world of a computer?',
      explore: 'Find 3 devices in your home that connect to the internet. Which parts of those devices "listen" to you, and which parts "speak" to you? Draw a diagram of this flow.',
      explain: 'Input devices (like keyboards, mice, and sensors) encode physical phenomena into binary data. Output devices (like screens and speakers) decode binary data back into physical phenomena (light, sound, motion).',
      elaborate: {
        'General': 'Ever wonder how a biometric fingerprint scanner at a bank works? It acts as an input device, taking your physical identity and safely translating it for digital validation.',
        'Junior Secondary': 'Think of input devices as the "ears and eyes" of your PC, and output devices as the "mouth and hands". If you play a video game, the controller is the input, and the TV is the output.'
      },
      evaluate: 'Reflection: If you had to invent a new input device for someone who cannot use their hands, what would it measure and how would it work?',
      constructivistNote: 'This module forces the learner to anchor the abstract concept of I/O to tangible objects in their immediate environment, maximizing cognitive retention.',
      questions: [
        {
          question: 'Which of the following is strictly an input device?',
          options: ['Monitor', 'Keyboard', 'Speaker', 'Printer'],
          correctAnswer: 1,
          explanation: 'A keyboard only sends data to the computer; it cannot display or generate data back to the user.'
        }
      ],
      createdBy: TEACHER_ID,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Module C: Digital Footprints
    await db.collection('modules').insertOne({
      title: 'Digital Shadows & Footprints',
      content: 'Evaluating the permanent trail we leave in digital environments and constructing a responsible online identity.',
      topicId: cyberEthicsId,
      type: 'project',
      engage: 'Did you know that a "deleted" post can sometimes be found years later? We call this our digital footprint.',
      explore: 'Try searching for your own name or a popular public figure. What different sources of information appear? How much of it was shared by them versus others?',
      explain: 'A digital footprint is the collection of all traces you leave online. It can be passive (data collected without you knowing) or active (what you post).',
      elaborate: {
        'Ethics': 'How would you feel if a future employer saw your current social media posts? Consider the importance of digital reputation.',
        'Safety': 'Privacy settings are your first line of defense, but the best protection is being mindful of what you share.'
      },
      evaluate: 'Design a "Digital Clean-up" plan for a student who wants to improve their online reputation before applying for university.',
      constructivistNote: 'Encourage students to view their digital identity as a professional portfolio that they are actively building.',
      questions: [
        {
          question: 'What is the most effective way to manage your digital footprint?',
          options: ['Deleting all accounts', 'Using a fake name', 'Mindful sharing and privacy hygiene', 'Ignoring it'],
          correctAnswer: 2,
          explanation: 'Mindful sharing and regular privacy checks are the most sustainable ways to build a positive digital presence.'
        }
      ],
      createdBy: TEACHER_ID,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Module D: Cyber Defense
    await db.collection('modules').insertOne({
      title: 'Cyber Defense: Defensive Maneuvers',
      content: 'Mastering the art of digital self-defense — from elite password hygiene to identifying sophisticated phishing attempts.',
      topicId: cyberEthicsId,
      type: 'activity',
      engage: 'Have you ever received a "critical" email from a bank you do not even use? Or been asked to "verify" your password for no reason? These are the front lines of digital warfare.',
      explore: 'Examine a series of "Look-alike" URLs (e.g., faceb00k.com, paypa1.com). How quickly can you spot the subtle mismatches? Why do attackers use these specific techniques?',
      explain: 'Phishing is a social engineering attack used to steal user data. Multifactor Authentication (MFA) and strong, unique passwords (using passphrases or managers) are your primary shields.',
      elaborate: {
        'Technical': 'Look for the "S" in HTTPS — even though it doesn\'t guarantee safety, its absence is a red flag. Always check the certificate domain.',
        'Behavioral': 'Adopt the "Zero Trust" mindset. If you didn\'t initiate the request, don\'t provide the data.'
      },
      evaluate: 'Develop a "Safety Checklist" for anyone checking their email on a public Wi-Fi network. What are the three most critical points?',
      constructivistNote: 'Encourage students to act as "Cyber Guardians" who teach their family members how to spot these threats.',
      questions: [
        {
          question: 'What is the most secure way to handle password management?',
          options: ['Using the same strong password everywhere', 'Writing passwords in a physical book', 'Using a reputable password manager with unique passphrases', 'Using "123456"'],
          correctAnswer: 2,
          explanation: 'A password manager allows you to have unique, complex passwords for every service without having to memorize them all.'
        }
      ],
      createdBy: TEACHER_ID,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('🏁 Seeding Completed Successfully! 🏳️');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
}

seed();
