const express = require('express');
const router = express.Router();
const courseController = require('../controller/courseController');

// Public endpoints
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Tutor endpoints
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);
router.get('/tutor/:tutorId', courseController.getTutorCourses);

module.exports = router;
