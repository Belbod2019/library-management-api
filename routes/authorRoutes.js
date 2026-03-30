const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthor);

// Protected routes (require authentication)
router.post('/', auth, authorController.createAuthor);
router.put('/:id', auth, authorController.updateAuthor);
router.delete('/:id', auth, authorController.deleteAuthor);

module.exports = router;