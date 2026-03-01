import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas using the URI from environment variables.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

export default connectDB;
