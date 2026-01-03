import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/besafe';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      // Remove deprecated options for newer mongoose versions
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
};

export default connectDB;

