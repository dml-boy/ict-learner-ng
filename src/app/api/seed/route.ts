import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Subject from '@/models/Subject';
import Topic from '@/models/Topic';
import Module from '@/models/Module';

const subjects = [
  {
    title: 'Computational Thinking & Web Crafting',
    description: 'Learn to build and solve problems using web technologies and logic.',
    icon: '🌐',
    color: '#059669',
    allowedContexts: ['Local Market Vendor', 'Cyber Café Owner', 'Agro-Business Starter'],
  },
];

export async function GET() {
  try {
    await dbConnect();

    // Clear existing data
    await Subject.deleteMany({});
    await Topic.deleteMany({});
    await Module.deleteMany({});

    for (const s of subjects) {
      const subject = await Subject.create(s);

      const topic1 = await Topic.create({
        title: 'Web Design for Community Impact',
        description: 'Designing user-friendly interfaces for local Nigerian businesses.',
        category: 'Frontend Development',
        subjectId: subject._id,
      });

      const topic2 = await Topic.create({
        title: 'Logic & Problem Solving',
        description: 'Using algorithms to solve logistical challenges in transportation.',
        category: 'Computer Science',
        subjectId: subject._id,
      });

      // Seed Modules for Topic 1
      await Module.create({
        title: 'Designing for the Lagos Street Market',
        content: 'In this module, we will explore how to design a digital storefront that works for users with limited data and basic smartphones.',
        topicId: topic1._id,
        type: 'project',
        engage: 'Imagine you are at Balogun Market. How do vendors show their products? How can we represent that same "customer feel" in a simple web app?',
        explore: 'Try creating a simple HTML card that lists a product name, price, and a "WhatsApp to Buy" button.',
        explain: 'A UI (User Interface) is how the customer interacts with your digital shop. For mobile-first users, buttons should be large and text should be clear.',
        elaborate: {
          'Local Market Vendor': 'Create a list of yams and plantains with weight and price per unit.',
          'Cyber Café Owner': 'Design a simple digital booking form for PC time.',
        },
        evaluate: 'Reflection: Why is "mobile-first" design particularly important in your local neighborhood?',
        constructivistNote: 'Students should build on their lived experience of visiting markets to design intuitive digital interfaces.',
        questions: [
          {
            question: 'Which element is most important for a customer with a slow internet connection?',
            options: ['High-resolution videos', 'Clear text and fast-loading images', 'Complex animations', 'Large background music files'],
            correctAnswer: 1,
            explanation: 'Fast-loading elements ensure that users with limited data can still access the information they need.',
          }
        ],
      });

      // Seed Modules for Topic 2
      await Module.create({
        title: 'Optimal Routing for BRT Buses',
        content: 'Learn how simple algorithms can help decide the fastest route through busy Lagos traffic.',
        topicId: topic2._id,
        type: 'activity',
        engage: 'Think about your commute. Which junctions are the bottlenecks? If you were the driver, how would you decide which side-street to take?',
        explore: 'Draw a map of your neighborhood and mark the travel time between points during rush hour.',
        explain: 'An algorithm is just a set of steps to solve a problem. The "Shortest Path" algorithm helps us find the most efficient route.',
        elaborate: {
          'Transport Manager': 'Optimize the route for 5 buses to ensure 10-minute intervals at all stops.',
          'Commuter': 'Find the best "Danfo Alternative" route to avoid Ikeja congestion.',
        },
        evaluate: 'How did your "mental algorithm" change after mapping out the actual travel times?',
        constructivistNote: 'Scaffold the concept of algorithms using the familiar context of navigating city traffic.',
        questions: [
          {
            question: 'What is an algorithm?',
            options: ['A type of computer screen', 'A set of steps to solve a problem', 'A high-speed bus', 'A programming language'],
            correctAnswer: 1,
            explanation: 'An algorithm is a step-by-step procedure for calculations or problem-solving.',
          }
        ],
      });
    }

    return NextResponse.json({ success: true, message: 'Seeding successful' });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
