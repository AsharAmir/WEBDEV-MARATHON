// import mongoose from 'mongoose';
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Lesson description is required'],
    trim: true
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required']
  },
  videoKey: {
    type: String,
    required: false
  },
  duration: {
    type: Number,
    default: 0
  },
  transcription: {
    type: String,
    default: ''
  },
  summary: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  order: {
    type: Number,
    required: [true, 'Lesson order is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course reference is required']
  },
  error: {
    type: String
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
lessonSchema.index({ course: 1, order: 1 });

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson; 
