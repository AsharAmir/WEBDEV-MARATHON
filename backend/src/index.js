require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const chatRoutes = require('./routes/chat');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect("mongodb+srv://maazawan100:maazawan2004@cluster0.g4ozi.mongodb.net/EdTech?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/chat', chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 