const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Author = require('./models/Author');
const Book = require('./models/Book');
const Student = require('./models/Student');
const LibraryAttendant = require('./models/LibraryAttendant');

const connectDB = require('./config/db');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    await connectDB();
    
    // Clear existing data
    console.log('📝 Clearing existing data...');
    await Author.deleteMany({});
    await Book.deleteMany({});
    await Student.deleteMany({});
    await LibraryAttendant.deleteMany({});
    
    console.log('✅ Existing data cleared');
    
    // Create authors
    console.log('📚 Creating authors...');
    const authors = await Author.insertMany([
      { name: 'J.K. Rowling', bio: 'British author, best known for Harry Potter', nationality: 'British' },
      { name: 'George Orwell', bio: 'English novelist and essayist', nationality: 'British' },
      { name: 'F. Scott Fitzgerald', bio: 'American novelist', nationality: 'American' }
    ]);
    
    console.log(`✅ Created ${authors.length} authors`);
    console.log('   Authors:', authors.map(a => a.name).join(', '));
    
    // Create students
    console.log('👥 Creating students...');
    const students = await Student.insertMany([
      { name: 'John Doe', email: 'john@school.edu', studentId: 'STU001' },
      { name: 'Jane Smith', email: 'jane@school.edu', studentId: 'STU002' },
      { name: 'Bob Wilson', email: 'bob@school.edu', studentId: 'STU003' }
    ]);
    
    console.log(`✅ Created ${students.length} students`);
    console.log('   Students:', students.map(s => s.name).join(', '));
    
    // Create attendants
    console.log('👔 Creating library attendants...');
    const attendants = await LibraryAttendant.insertMany([
      { name: 'Sarah Johnson', staffId: 'ATT001' },
      { name: 'Mike Brown', staffId: 'ATT002' }
    ]);
    
    console.log(`✅ Created ${attendants.length} attendants`);
    console.log('   Attendants:', attendants.map(a => a.name).join(', '));
    
    // Create books
    console.log('📖 Creating books...');
    const books = await Book.insertMany([
      {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        isbn: '9780439708180',
        authors: [authors[0]._id],
        publisher: 'Scholastic',
        year: 1997,
        copies: 5,
        availableCopies: 5,
        status: 'IN'
      },
      {
        title: '1984',
        isbn: '9780451524935',
        authors: [authors[1]._id],
        publisher: 'Secker & Warburg',
        year: 1949,
        copies: 3,
        availableCopies: 3,
        status: 'IN'
      },
      {
        title: 'The Great Gatsby',
        isbn: '9780743273565',
        authors: [authors[2]._id],
        publisher: 'Scribner',
        year: 1925,
        copies: 4,
        availableCopies: 4,
        status: 'IN'
      },
      {
        title: 'Harry Potter and the Chamber of Secrets',
        isbn: '9780439064873',
        authors: [authors[0]._id],
        publisher: 'Scholastic',
        year: 1998,
        copies: 3,
        availableCopies: 3,
        status: 'IN'
      }
    ]);
    
    console.log(`✅ Created ${books.length} books`);
    console.log('   Books:', books.map(b => b.title).join(', '));
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 For testing:');
    console.log('Students:');
    students.forEach(s => {
      console.log(`   ${s.name} (${s.studentId}) - ID: ${s._id}`);
    });
    console.log('\nAttendants:');
    attendants.forEach(a => {
      console.log(`   ${a.name} (${a.staffId}) - ID: ${a._id}`);
    });
    console.log('\nBooks:');
    books.forEach(b => {
      console.log(`   ${b.title} - ID: ${b._id}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();