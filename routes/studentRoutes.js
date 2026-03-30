const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');

// Public routes (no authentication needed for viewing)
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudent);

// Protected routes (require authentication for modifications)
router.post('/', auth, studentController.createStudent);
router.put('/:id', auth, studentController.updateStudent);
router.delete('/:id', auth, studentController.deleteStudent);

module.exports = router;