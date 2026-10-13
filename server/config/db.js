const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the connection string in the environment.
 * Throws a readable error if the connection cannot be made.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri === 'your_mongodb_connection_string') {
    throw new Error(
      'MONGODB_URI is not set. Copy server/.env.example to server/.env and add your MongoDB connection string.'
    );
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connected:', mongoose.connection.name);
  } catch (err) {
    // Do not print the full URI: it contains the database password.
    throw new Error(
      `Could not connect to MongoDB (${err.message}). Check your connection string, your password, and the Atlas "Network Access" IP allow-list.`
    );
  }
}

module.exports = connectDB;
