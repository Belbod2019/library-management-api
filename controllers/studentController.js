const Student = require('../models/Student');

// @desc    Create a new student
// @route   POST /api/students
// @access  Private
exports.createStudent = async (req, res) => {
    try {
        const { name, email, studentId, password } = req.body;

        // Check if student already exists
        const existingStudent = await Student.findOne({ $or: [{ email }, { studentId }] });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already exists with this email or ID' });
        }

        const student = new Student({
            name,
            email,
            studentId,
            password
        });

        await student.save();
        res.status(201).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().select('-password');
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private
exports.getStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).select('-password');
        
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        
        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
exports.updateStudent = async (req, res) => {
    try {
        const { name, email, studentId } = req.body;
        
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        
        student.name = name || student.name;
        student.email = email || student.email;
        student.studentId = studentId || student.studentId;
        
        await student.save();
        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        
        await student.remove();
        res.json({ message: 'Student removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};