const Book = require('../models/Book');
const Student = require('../models/Student');
const LibraryAttendant = require('../models/LibraryAttendant');

// POST /books - Create book (with multiple authors)
exports.createBook = async (req, res) => {
  try {
    const { title, isbn, authors, publisher, year, copies, shelfLocation } = req.body;
    
    // Check for duplicate ISBN
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ error: 'Book with this ISBN already exists' });
    }
    
    const book = await Book.create({
      title,
      isbn,
      authors, // Array of author IDs
      publisher,
      year,
      copies,
      availableCopies: copies,
      shelfLocation,
      status: 'IN'
    });
    
    const populatedBook = await Book.findById(book._id).populate('authors');
    res.status(201).json(populatedBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET /books - Get all books with PAGINATION
exports.getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / limit);

    const books = await Book.find()
      .populate('authors')
      .populate('borrowedBy')  // Populate student details when borrowed
      .populate('issuedBy')    // Populate attendant details when borrowed
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: books.length,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalBooks: totalBooks,
        limit: limit
      },
      data: books
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /books/search - SEARCH books by title or author
exports.searchBooks = async (req, res) => {
  try {
    const { title, author } = req.query;
    
    let query = {};
    
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }
    
    if (author) {
      const Author = require('../models/Author');
      const matchingAuthors = await Author.find({
        name: { $regex: author, $options: 'i' }
      });
      
      const authorIds = matchingAuthors.map(a => a._id);
      query.authors = { $in: authorIds };
    }
    
    const books = await Book.find(query)
      .populate('authors')
      .populate('borrowedBy')
      .populate('issuedBy');
    
    res.json({
      success: true,
      count: books.length,
      searchCriteria: { title, author },
      data: books
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /books/overdue - Get all overdue books
exports.getOverdueBooks = async (req, res) => {
  try {
    const today = new Date();
    
    const overdueBooks = await Book.find({
      status: 'OUT',
      returnDate: { $lt: today }
    })
    .populate('authors')
    .populate('borrowedBy')
    .populate('issuedBy');

    const overdueWithDays = overdueBooks.map(book => {
      const daysOverdue = Math.ceil((today - new Date(book.returnDate)) / (1000 * 60 * 60 * 24));
      return {
        ...book.toObject(),
        daysOverdue: daysOverdue
      };
    });

    res.json({
      success: true,
      count: overdueWithDays.length,
      data: overdueWithDays
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /books/:id - Get single book (with populated data)
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('authors')
      .populate('borrowedBy')
      .populate('issuedBy');
    
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /books/:id - Update book
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('authors');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /books/:id - Delete book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /books/:id/borrow - Borrow book
exports.borrowBook = async (req, res) => {
  try {
    const { studentId, attendantId, returnDate } = req.body;
    const book = await Book.findById(req.params.id);
    
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.status === 'OUT') return res.status(400).json({ message: 'Book is already borrowed' });
    
    // Validate student and attendant exist
    const student = await Student.findById(studentId);
    const attendant = await LibraryAttendant.findById(attendantId);
    
    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (!attendant) return res.status(404).json({ message: 'Attendant not found' });
    
    book.status = 'OUT';
    book.borrowedBy = studentId;
    book.issuedBy = attendantId;
    book.returnDate = returnDate;
    
    await book.save();
    
    const populatedBook = await Book.findById(book._id)
      .populate('authors')
      .populate('borrowedBy')
      .populate('issuedBy');
    
    res.json({ message: 'Book borrowed successfully', book: populatedBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /books/:id/return - Return book
exports.returnBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.status === 'IN') return res.status(400).json({ message: 'Book is already available' });
    
    book.status = 'IN';
    book.borrowedBy = null;
    book.issuedBy = null;
    book.returnDate = null;
    
    await book.save();
    
    const populatedBook = await Book.findById(book._id)
      .populate('authors');
    
    res.json({ message: 'Book returned successfully', book: populatedBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};