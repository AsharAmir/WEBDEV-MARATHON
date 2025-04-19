const mongoose = require('mongoose');
// import mongoose from 'mongoose';
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tutorName: {
    type: String,
    required: true
  },
  tutorAvatar: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  categories: [{
    type: String,
    required: true
  }],
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
courseSchema.index({ tutorId: 1 });
courseSchema.index({ categories: 1 });
courseSchema.index({ title: 'text', description: 'text' });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course; 