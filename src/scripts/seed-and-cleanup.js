const mongoose = require('mongoose');
const dns = require('dns');

// Force Google DNS for SRV lookups
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const MONGODB_URI = 'mongodb://Mubarak:ddZFO2wQQWQV6DMi@dml-cluster-shard-00-00.3j5lw.mongodb.net:27017,dml-cluster-shard-00-01.3j5lw.mongodb.net:27017,dml-cluster-shard-00-02.3j5lw.mongodb.net:27017/ict-learner-nigeria?ssl=true&replicaSet=atlas-12fagn-shard-0&authSource=admin&appName=dml-cluster';

const DEFAULT_USER_ID = "65f1234567890abcd1234567";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  const ModuleSchema = new mongoose.Schema({
    title: String,
    content: String,
    topicId: mongoose.Schema.Types.ObjectId,
    type: String,
    engage: String,
    engageQuestions: Array,
    explore: String,
    explain: String,
    elaborate: Map,
    evaluate: String,
    questions: Array,
    createdBy: mongoose.Schema.Types.ObjectId,
  }, { timestamps: true });

  const Module = mongoose.models.Module || mongoose.model('Module', ModuleSchema, 'modules');
  const Topic = mongoose.models.Topic || mongoose.model('Topic', new mongoose.Schema({ title: String }), 'topics');

  // 1. Delete all other modules
  await Module.deleteMany({});
  console.log('Cleared all previous modules.');

  // 2. Ensure a topic exists
  let topic = await Topic.findOne({ title: 'Computer Science' });
  if (!topic) {
    topic = await Topic.create({ title: 'Computer Science' });
  }

  // 3. Create Introduction to Algorithm module
  const algoModule = {
    title: "Introduction to Algorithm",
    content: "Algorithms are step-by-step procedures for solving problems. They are the backbone of all computer programs.",
    topicId: topic._id,
    type: "lesson",
    engage: "Think about how you made your way to school today. Can you break down every single turn, decision, and step you took into a simple list?",
    engageQuestions: [
      {
        question: "How would you define a sequence of steps to bake a cake?",
        options: ["An Algorithm", "A Variable", "A Database", "A Network"],
        correctAnswer: 0,
        explanation: "A sequence of steps to solve a problem or complete a task is an algorithm."
      },
      {
        question: "Do you think algorithms only exist in computers?",
        options: ["Yes, only in hardware", "No, they occur in daily life", "Only in mathematics", "Only in self-driving cars"],
        correctAnswer: 1,
        explanation: "Algorithms are fundamental logical structures used in daily life, from recipes to directions."
      },
      {
        question: "Which of these is a key quality of a good algorithm?",
        options: ["Vagueness", "Infinite length", "Precision and clarity", "Randomness"],
        correctAnswer: 2,
        explanation: "Algorithms must be clear and precise so they can be followed consistently."
      },
      {
        question: "What happens if an algorithm has an error?",
        options: ["It works faster", "It produces an incorrect result", "It deletes itself", "Nothing happens"],
        correctAnswer: 1,
        explanation: "Logical errors in an algorithm lead to 'bugs' and incorrect outcomes."
      },
      {
        question: "Why do we use flowcharts for algorithms?",
        options: ["To make them pretty", "To visualize the logic flow", "To encrypt the data", "To hide the meaning"],
        correctAnswer: 1,
        explanation: "Flowcharts help us see the path and decision points of an algorithm visually."
      }
    ],
    explore: "Search for 'The Stable Marriage Algorithm' or 'The Sorting Hat Algorithm'. How do these logic sets solve complex social problems?",
    explain: "An algorithm is a finite sequence of well-defined, computer-implementable instructions, typically to solve a class of problems or to perform a computation. They are usually represented through pseudocode or flowcharts.",
    elaborate: {
      "General ICT Student": "Imagine you are building a simple app for a Nigerian market. What algorithm would handle 'Calculating the total price of 5 bags of rice with a 10% discount'?",
      "Future Software Architect": "Compare the efficiency of a Linear Search vs a Binary Search algorithm for a database of 100 million Nigerian ID records.",
      "Data Scientist": "Explore how an algorithm like K-Means Clustering could help group regional electricity consumption patterns in Nigeria."
    },
    evaluate: "What is the most complex algorithm you use in your daily routine without thinking about it?",
    questions: [
      {
        question: "What is a flowchart primarily used for?",
        options: ["Drawing pictures", "Visualizing an algorithm", "Storing data", "Hiding code"],
        correctAnswer: 1,
        explanation: "Flowcharts are visual maps of an algorithm's logic."
      },
      {
        question: "Which term describes a step-by-step procedure?",
        options: ["Component", "Algorithm", "Infrastructure", "Protocol"],
        correctAnswer: 1,
        explanation: "Algorithm is the correct term for a procedural sequence of instructions."
      },
      {
        question: "Is 'making a cup of tea' an algorithm?",
        options: ["Yes", "No", "Only if a robot does it", "Only in the morning"],
        correctAnswer: 0,
        explanation: "Yes, it is a sequence of discrete steps to achieve a goal."
      }
    ],
    createdBy: new mongoose.Types.ObjectId(DEFAULT_USER_ID)
  };

  const created = await Module.create(algoModule);
  console.log('Seeded Introduction to Algorithm module with ID:', created._id);

  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
