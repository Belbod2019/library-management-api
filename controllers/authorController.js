const Author = require('../models/Author');

// @desc    Create a new author
// @route   POST /api/authors
// @access  Private
exports.createAuthor = async (req, res) => {
    try {
        const { name, biography, birthDate, nationality } = req.body;

        // Check if author already exists
        const existingAuthor = await Author.findOne({ name });
        if (existingAuthor) {
            return res.status(400).json({ message: 'Author already exists' });
        }

        const author = new Author({
            name,
            biography,
            birthDate,
            nationality
        });

        await author.save();
        res.status(201).json(author);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all authors
// @route   GET /api/authors
// @access  Public
exports.getAllAuthors = async (req, res) => {
    try {
        const authors = await Author.find();
        res.json(authors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single author by ID
// @route   GET /api/authors/:id
// @access  Public
exports.getAuthor = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        
        res.json(author);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update author
// @route   PUT /api/authors/:id
// @access  Private
exports.updateAuthor = async (req, res) => {
    try {
        const { name, biography, birthDate, nationality } = req.body;
        
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        
        author.name = name || author.name;
        author.biography = biography || author.biography;
        author.birthDate = birthDate || author.birthDate;
        author.nationality = nationality || author.nationality;
        
        await author.save();
        res.json(author);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete author
// @route   DELETE /api/authors/:id
// @access  Private
exports.deleteAuthor = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        
        await author.remove();
        res.json({ message: 'Author removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};