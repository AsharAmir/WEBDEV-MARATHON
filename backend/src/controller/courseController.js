const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const mongoose = require('mongoose');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const { category, level, search, sortBy } = req.query;
    let query = {};

    if (category && category !== 'All Categories') query.categories = category;
    if (level && level !== 'All Levels') query.level = level.toLowerCase();
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let courses = await Course.find(query).populate('tutorId', 'name avatar').lean();

    courses = courses.map(course => {
      const tutor = course.tutorId || {};
      return {
        _id: course._id?.toString() || '',
        title: course.title || '',
        description: course.description || '',
        price: course.price || 0,
        level: course.level || 'beginner',
        categories: course.categories || [],
        tutorId: tutor._id?.toString() || '',
        tutorName: tutor.name || 'Unknown Tutor',
        tutorAvatar: tutor.avatar || '',
        totalStudents: course.totalStudents || 0,
        rating: course.rating || 0,
        createdAt: course.createdAt ? new Date(course.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: course.updatedAt ? new Date(course.updatedAt).toISOString() : new Date().toISOString()
      };
    });

    if (sortBy) {
      switch (sortBy) {
        case 'popular': courses.sort((a, b) => b.totalStudents - a.totalStudents); break;
        case 'rating': courses.sort((a, b) => b.rating - a.rating); break;
        case 'newest': courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
        case 'price-low': courses.sort((a, b) => a.price - b.price); break;
        case 'price-high': courses.sort((a, b) => b.price - a.price); break;
      }
    }

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// Get single course
exports.getCourseById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }
    const course = await Course.findById(req.params.id).populate('tutorId', 'name avatar bio');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

// Create new course
exports.createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

// Get tutor's courses with enrolled students
exports.getTutorCourses = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.tutorId)) {
      return res.status(400).json({ message: 'Invalid tutor ID' });
    }

    const courses = await Course.find({ tutorId: req.params.tutorId }).populate('tutorId', 'name avatar').lean();
    const courseIds = courses.map(course => course._id);
    const enrollments = await Enrollment.find({ courseId: { $in: courseIds } }).populate('studentId', 'name email').lean();

    const result = courses.map(course => {
      const courseEnrollments = enrollments.filter(e => e.courseId.toString() === course._id.toString());
      return {
        ...course,
        _id: course._id.toString(),
        tutorId: course.tutorId._id.toString(),
        tutorName: course.tutorId.name,
        tutorAvatar: course.tutorId.avatar,
        enrollments: courseEnrollments.map(e => ({
          studentId: e.studentId._id.toString(),
          studentName: e.studentId.name,
          studentEmail: e.studentId.email,
          enrolledAt: e.enrolledAt,
          progress: e.progress,
          status: e.status
        }))
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching tutor courses:', error);
    res.status(500).json({ message: 'Error fetching tutor courses', error: error.message });
  }
};
