// controllers/authController.js
const Student = require('../models/Student');
const LibraryAttendant = require('../models/LibraryAttendant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to find user by email across both collections
const findUserByEmail = async (email) => {
    let user = await Student.findOne({ email });
    let role = 'student';
    
    if (!user) {
        user = await LibraryAttendant.findOne({ email });
        role = 'attendant';
    }
    
    return { user, role };
};

// Helper function to create token
const generateToken = (userId, role) => {
    const payload = {
        user: {
            id: userId,
            role: role
        }
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new student
// @route   POST /api/auth/register/student
// @access  Public
exports.registerStudent = async (req, res) => {
    try {
        const { name, email, password, studentId } = req.body;

        // Check if user already exists
        let user = await Student.findOne({ $or: [{ email }, { studentId }] });
        if (user) {
            return res.status(400).json({ message: 'Student already exists with this email or ID' });
        }

        // Create student
        user = new Student({
            name,
            email,
            password,
            studentId
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Create token
        const token = generateToken(user._id, 'student');

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                studentId: user.studentId,
                role: 'student'
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Register a new attendant
// @route   POST /api/auth/register/attendant
// @access  Public
exports.registerAttendant = async (req, res) => {
    try {
        const { name, email, password, staffId } = req.body;

        // Check if attendant already exists
        let user = await LibraryAttendant.findOne({ $or: [{ email }, { staffId }] });
        if (user) {
            return res.status(400).json({ message: 'Attendant already exists with this email or staff ID' });
        }

        // Create attendant
        user = new LibraryAttendant({
            name,
            email,
            password,
            staffId
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Create token
        const token = generateToken(user._id, 'attendant');

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                staffId: user.staffId,
                role: 'attendant'
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Login user (student or attendant)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user in either collection
        const { user, role } = await findUserByEmail(email);
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = generateToken(user._id, role);

        // Prepare response based on role
        let userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: role
        };
        
        if (role === 'student') {
            userResponse.studentId = user.studentId;
        } else {
            userResponse.staffId = user.staffId;
        }

        res.json({
            success: true,
            token,
            user: userResponse
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        
        let user;
        if (role === 'student') {
            user = await Student.findById(userId).select('-password');
        } else {
            user = await LibraryAttendant.findById(userId).select('-password');
        }
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};