const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const MONGODB_URI = 'mongodb://Mubarak:ddZFO2wQQWQV6DMi@dml-cluster-shard-00-00.3j5lw.mongodb.net:27017,dml-cluster-shard-00-01.3j5lw.mongodb.net:27017,dml-cluster-shard-00-02.3j5lw.mongodb.net:27017/ict-learner-nigeria?ssl=true&replicaSet=atlas-12fagn-shard-0&authSource=admin&appName=dml-cluster';
const DEFAULT_USER_ID = "65f1234567890abcd1234567";

async function fixData() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to Shared DB');

  const userId = new mongoose.Types.ObjectId(DEFAULT_USER_ID);

  // 1. Fix Subjects
  const subjUpdate = await mongoose.connection.db.collection('subjects').updateMany(
    { createdBy: { $exists: false } },
    { $set: { createdBy: userId } }
  );
  console.log(`Updated ${subjUpdate.modifiedCount} Subjects with missing createdBy.`);

  // 2. Fix Topics
  const topicUpdate = await mongoose.connection.db.collection('topics').updateMany(
    { createdBy: { $exists: false } },
    { $set: { createdBy: userId } }
  );
  console.log(`Updated ${topicUpdate.modifiedCount} Topics with missing createdBy.`);

  // 3. Fix Modules (just in case)
  const modUpdate = await mongoose.connection.db.collection('modules').updateMany(
    { createdBy: { $exists: false } },
    { $set: { createdBy: userId } }
  );
  console.log(`Updated ${modUpdate.modifiedCount} Modules with missing createdBy.`);

  // 4. Final Verification
  const check = await mongoose.connection.db.collection('topics').findOne({ title: 'Algorithms' });
  console.log('Verification: Topic "Algorithms" createdBy:', check?.createdBy);

  console.log('Database Alignment Complete.');
  process.exit();
}

fixData().catch(err => {
  console.error(err);
  process.exit(1);
});
