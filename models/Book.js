const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  isbn: { 
    type: String, 
    unique: true 
  },
  authors: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Author' 
  }],  // Changed from single author to array
  status: { 
    type: String, 
    enum: ['IN', 'OUT'], 
    default: 'IN' 
  },
  borrowedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    default: null 
  },
  issuedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'LibraryAttendant', 
    default: null 
  },
  returnDate: { 
    type: Date, 
    default: null 
  },
  publisher: String,
  year: Number,
  copies: { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 },
  shelfLocation: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Book', bookSchema);
