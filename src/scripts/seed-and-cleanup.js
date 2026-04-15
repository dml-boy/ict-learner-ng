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
    explore: "Find a recipe for making Jollof Rice. Identify the clear, numbered steps. What happens if you skip step #2? This is the core of logical dependency.",
    explain: `### Masterclass: The Architecture of Algorithmic Logic

#### I. Formal Definition
An algorithm is a finite, unambiguous, and step-by-step procedure for solving a problem or accomplishing a specific task. In the realm of Computer Science, algorithms are the 'instruction manuals' for hardware. Unlike a vague instruction like 'cook food', an algorithm defines every discrete state transition required to reach a goal.

#### II. The Five Pillars of a Valid Algorithm
For a sequence of instructions to qualify as a formal algorithm, it must satisfy five rigorous criteria established by Donald Knuth:
1. **Finiteness:** The algorithm must terminate after a finite number of steps. It cannot loop infinitely.
2. **Definiteness:** Each step must be precisely defined. The actions to be carried out must be rigorously and unambiguously specified for each case.
3. **Input:** An algorithm has zero or more inputs, taken from a specified set of objects.
4. **Output:** An algorithm has one or more outputs, which have a specified relation to the inputs.
5. **Effectiveness:** The algorithm is generally expected to be effective, in the sense that its operations must all be sufficiently basic that they can in principle be done exactly and in a finite length of time.

#### III. Expressing Algorithms: Pseudocode and Flowcharts
Algorithms are not code; they are the logic *behind* the code. We express them through:
- **Pseudocode:** A high-level description of an algorithm that uses the structural conventions of programming languages but is intended for human reading.
- **Flowcharts:** Visual diagrams representing the sequence of operations in a system. Standard symbols (Ovals for Start/End, Rectangles for Processes, Diamonds for Decisions) ensure universal readability.

#### IV. Control Structures: The DNA of Logic
Every complex algorithm is built from three fundamental building blocks:
1. **Sequence:** The linear execution of steps in order.
2. **Selection (Decision):** The use of 'IF-THEN-ELSE' logic to fork the path based on conditions.
3. **Iteration (Looping):** The repetition of steps until a specific condition is met (e.g., 'FOR', 'WHILE').

#### V. Complexity: Evaluating Efficiency
In academic ICT, we don't just ask if an algorithm works; we ask how *well* it works. This is measured through:
- **Time Complexity:** How the execution time increases with the size of the input (Big O Notation).
- **Space Complexity:** How much memory the algorithm requires during execution.

#### VI. Case Study: The Nigerian Fintech Ecosystem
Consider a Nigerian bank transfer. The algorithm manages:
1. Validating the sender's balance (Selection).
2. Debiting the sender and Crediting the receiver (Sequence).
3. Sending SMS alerts (Selection/Action).
If any step in this rigorous sequence fails, the entire transaction must be rolled back to ensure data integrity.`,
    elaborate: {
      "General ICT Student": "Design a pseudocode algorithm for a simple school grading system based on Nigerian WAEC standards (A1 to F9).",
      "Future Software Architect": "Analyze the Big O complexity of a nested loop used to sort a list of every registered voter in Lagos State.",
      "Data Scientist": "Explore how recursive algorithms are used to map population growth trends across different Nigerian geopolitical zones."
    },
    evaluate: "If an algorithm lacks 'Finiteness', why is it considered invalid in Computer Science?",
    questions: [
      {
        question: "Which of Knuth's five pillars ensures an algorithm will eventually stop?",
        options: ["Definiteness", "Finiteness", "Effectiveness", "Input"],
        correctAnswer: 1,
        explanation: "Finiteness guarantees that the algorithm does not run into an infinite loop."
      },
      {
        question: "In a flowchart, what does a Diamond shape represent?",
        options: ["A process", "Start/End", "A decision point", "Input/Output"],
        correctAnswer: 2,
        explanation: "The diamond symbol is used for Selection or Decision-making logic."
      },
      {
        question: "What is 'Pseudocode' primarily used for?",
        options: ["Writing raw machine code", "Visualizing hardware", "Human-readable logical mapping", "Database storage"],
        correctAnswer: 2,
        explanation: "Pseudocode bridges the gap between human language and computer code for planning logic."
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
