const express = require('express');
const router = express.Router();
const attendantController = require('../controllers/attendantController');
const auth = require('../middleware/auth');

// Public routes (no authentication needed for viewing)
router.get('/', attendantController.getAllAttendants);
router.get('/:id', attendantController.getAttendant);

// Protected routes (require authentication for modifications)
router.post('/', auth, attendantController.createAttendant);
router.put('/:id', auth, attendantController.updateAttendant);
router.delete('/:id', auth, attendantController.deleteAttendant);

module.exports = router;