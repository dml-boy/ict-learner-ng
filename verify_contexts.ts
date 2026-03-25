import mongoose from 'mongoose';
import dbConnect from './src/lib/dbConnect';
import Subject from './src/models/Subject';
import Topic from './src/models/Topic';
import Module from './src/models/Module';

async function verify() {
  await dbConnect();
  console.log('--- Verification Started ---');

  // 1. Create a Subject with restricted contexts
  const sub = await Subject.create({
    title: 'Economics (Test)',
    description: 'Testing restricted contexts',
    allowedContexts: ['Trader', 'Regular Student']
  });
  console.log('Subject created with contexts:', sub.allowedContexts);

  // 2. Create a Topic
  const topic = await Topic.create({
    title: 'Market Dynamics (Test)',
    description: 'Topic for testing',
    subjectId: sub._id
  });
  console.log('Topic created linked to Subject:', topic._id);

  // 3. Create a Module
  const mod = await Module.create({
    title: 'Supply and Demand (Test)',
    content: 'Standard supply and demand content',
    engage: 'Welcome to Economics: How does price affect your daily shopping?',
    explore: 'Interactive market simulation activity.',
    explain: 'Theoretical foundations of supply and demand curves.',
    topicId: topic._id,
    type: 'lesson',
    elaborate: {
      'Trader': 'For a trader, supply and demand is about price action and volume.',
      'Regular Student': 'For a student, it is about the intersection of curves in a textbook.'
    },
    evaluate: 'Quick check on market equilibrium concept.'
  });
  console.log('Module created with contextual content');

  // 4. Test Deep Population (Simulate API)
  const populatedMod = await Module.findById(mod._id).populate({
    path: 'topicId',
    populate: { path: 'subjectId' }
  });

  const subject = (populatedMod?.topicId as any)?.subjectId;
  console.log('Populated Subject Contexts:', subject?.allowedContexts);
  
  if (JSON.stringify(subject?.allowedContexts) === JSON.stringify(['Trader', 'Regular Student'])) {
    console.log('SUCCESS: Context inheritance verified!');
  } else {
    console.log('FAILURE: Context inheritance mismatch');
  }

  // Cleanup
  await Module.findByIdAndDelete(mod._id);
  await Topic.findByIdAndDelete(topic._id);
  await Subject.findByIdAndDelete(sub._id);
  console.log('Cleanup complete.');
  process.exit(0);
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
