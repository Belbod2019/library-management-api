const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create Express app
const app = express();

// Middleware - Parse JSON bodies
app.use(express.json());

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/books', require('./routes/bookRoutes'));
app.use('/authors', require('./routes/authorRoutes'));
app.use('/students', require('./routes/studentRoutes'));
app.use('/attendants', require('./routes/attendantRoutes'));

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to School Library Management API',
    features: ['Pagination', 'Search', 'Overdue Check', 'JWT Auth'],
    documentation: 'See README.md'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API ready at: http://localhost:${PORT}`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/auth`);
});