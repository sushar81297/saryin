// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');
    console.log(`Database: ${mongoose.connection.db.databaseName}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw new Error('Failed to connect to MongoDB');
  }
};
module.exports = connectDB;
