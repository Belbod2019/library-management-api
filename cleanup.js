const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');

const cleanup = async () => {
  try {
    await connectDB();
    
    console.log('🗑️  Dropping collections...');
    
    // Drop collections if they exist
    const collections = ['libraryattendants', 'students', 'authors', 'books'];
    
    for (const collection of collections) {
      try {
        await mongoose.connection.db.dropCollection(collection);
        console.log(`✅ Dropped ${collection} collection`);
      } catch (err) {
        console.log(`⚠️  ${collection} collection doesn't exist or already dropped`);
      }
    }
    
    console.log('\n✅ Cleanup completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

cleanup();