import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'stackedtime';

if (!MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

export const connectToDatabase = async () => {
  try {
    // If already connected, return
    if (mongoose.connection.readyState === 1) {
      // Check if we're connected to the right database
      if (mongoose.connection.db?.databaseName === DB_NAME) {
        return Promise.resolve(true);
      }
      // If wrong database, disconnect first
      await mongoose.disconnect();
    }

    // Connect with explicit database name
    const { connection } = await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME
    });
    
    if (connection.readyState === 1) {
      console.log('Connected to database:', connection.db?.databaseName || DB_NAME);
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return Promise.reject(error);
  }
}; 