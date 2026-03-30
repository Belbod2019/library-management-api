const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/auth');

// Public routes (no authentication needed)
router.get('/search', bookController.searchBooks);
router.get('/overdue', bookController.getOverdueBooks);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBook);

// Protected routes (require authentication)
router.post('/', auth, bookController.createBook);
router.put('/:id', auth, bookController.updateBook);
router.delete('/:id', auth, bookController.deleteBook);
router.post('/:id/borrow', auth, bookController.borrowBook);
router.post('/:id/return', auth, bookController.returnBook);

module.exports = router;