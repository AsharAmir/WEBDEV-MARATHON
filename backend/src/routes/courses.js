const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get all courses with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, level, search, sortBy } = req.query;
    let query = {};

    // Apply filters
    if (category && category !== 'All Categories') {
      query.categories = category;
    }
    if (level && level !== 'All Levels') {
      query.level = level.toLowerCase();
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get courses
    let courses = await Course.find(query).populate('tutorId', 'name avatar');

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case 'popular':
          courses.sort((a, b) => b.totalStudents - a.totalStudents);
          break;
        case 'rating':
          courses.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          courses.sort((a, b) => b.createdAt - a.createdAt);
          break;
        case 'price-low':
          courses.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          courses.sort((a, b) => b.price - a.price);
          break;
      }
    }

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('tutorId', 'name avatar bio');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
});

// Create new course (tutor only)
router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
});

// Update course (tutor only)
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
});

// Delete course (tutor only)
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
});

module.exports = router; 