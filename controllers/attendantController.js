const LibraryAttendant = require('../models/LibraryAttendant');

// @desc    Create a new attendant
// @route   POST /api/attendants
// @access  Private
exports.createAttendant = async (req, res) => {
    try {
        const { name, email, staffId, password } = req.body;

        // Check if attendant already exists
        const existingAttendant = await LibraryAttendant.findOne({ $or: [{ email }, { staffId }] });
        if (existingAttendant) {
            return res.status(400).json({ message: 'Attendant already exists with this email or staff ID' });
        }

        const attendant = new LibraryAttendant({
            name,
            email,
            staffId,
            password
        });

        await attendant.save();
        res.status(201).json(attendant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all attendants
// @route   GET /api/attendants
// @access  Private
exports.getAllAttendants = async (req, res) => {
    try {
        const attendants = await LibraryAttendant.find().select('-password');
        res.json(attendants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single attendant by ID
// @route   GET /api/attendants/:id
// @access  Private
exports.getAttendant = async (req, res) => {
    try {
        const attendant = await LibraryAttendant.findById(req.params.id).select('-password');
        
        if (!attendant) {
            return res.status(404).json({ message: 'Attendant not found' });
        }
        
        res.json(attendant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update attendant
// @route   PUT /api/attendants/:id
// @access  Private
exports.updateAttendant = async (req, res) => {
    try {
        const { name, email, staffId } = req.body;
        
        const attendant = await LibraryAttendant.findById(req.params.id);
        if (!attendant) {
            return res.status(404).json({ message: 'Attendant not found' });
        }
        
        attendant.name = name || attendant.name;
        attendant.email = email || attendant.email;
        attendant.staffId = staffId || attendant.staffId;
        
        await attendant.save();
        res.json(attendant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete attendant
// @route   DELETE /api/attendants/:id
// @access  Private
exports.deleteAttendant = async (req, res) => {
    try {
        const attendant = await LibraryAttendant.findById(req.params.id);
        if (!attendant) {
            return res.status(404).json({ message: 'Attendant not found' });
        }
        
        await attendant.remove();
        res.json({ message: 'Attendant removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};