const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  transcript: {
    type: String,
    default: ''
  }
});

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
  lessons: [lessonSchema],
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
});

module.exports = mongoose.model('Course', courseSchema); 