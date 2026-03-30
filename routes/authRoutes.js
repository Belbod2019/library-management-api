const express = require('express');
const router = express.Router();
const { registerStudent, registerAttendant, login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register/student', registerStudent);
router.post('/register/attendant', registerAttendant);
router.post('/login', login);

// Private routes
router.get('/me', auth, getMe);

module.exports = router;