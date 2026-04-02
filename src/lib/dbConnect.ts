import mongoose from 'mongoose';
import dns from 'dns';

// Force Google DNS for SRV/TXT lookups — fixes ESERVFAIL on restricted networks with mongodb+srv://
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);


interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const URI = process.env.MONGODB_URI;
    if (!URI) {
      throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4 — avoids SRV AAAA lookup failures on restricted networks
    };
    cached.promise = mongoose.connect(URI, opts)
      .then((mongooseInstance) => mongooseInstance)
      .catch((err) => {
        // Clear promise on failure so the next request retries
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}

export default dbConnect;
