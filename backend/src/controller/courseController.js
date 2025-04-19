const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');
const { transcribeVideo } = require('../utils/ai');
const Lesson = require('../models/Lesson');

// Initialize Supabase client
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('Supabase configuration is missing. Please check your environment variables.');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

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

    let courses = await Course.find(query)
      .populate('tutorId', 'name avatar')
      .populate({
        path: 'lessons',
        options: { sort: { order: 1 } }
      })
      .lean();

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
        lessons: course.lessons || [],
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
    const course = await Course.findById(req.params.id)
      .populate('tutorId', 'name avatar bio')
      .populate({
        path: 'lessons',
        select: 'title description videoUrl duration status order',
        options: { sort: { order: 1 } }
      });

    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Convert to a plain object and ensure lessons array exists
    const courseObj = course.toObject();
    courseObj.lessons = courseObj.lessons || [];

    res.json(courseObj);
  } catch (error) {
    console.error('Error fetching course:', error);
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

    const courses = await Course.find({ tutorId: req.params.tutorId })
      .populate('tutorId', 'name avatar')
      .populate({
        path: 'lessons',
        options: { sort: { order: 1 } }
      })
      .lean();
    
    const courseIds = courses.map(course => course._id);
    const enrollments = await Enrollment.find({ courseId: { $in: courseIds } })
      .populate('studentId', 'name email')
      .lean();

    const result = courses.map(course => {
      const courseEnrollments = enrollments.filter(e => e.courseId.toString() === course._id.toString());
      return {
        ...course,
        _id: course._id.toString(),
        tutorId: course.tutorId._id.toString(),
        tutorName: course.tutorId.name,
        tutorAvatar: course.tutorId.avatar,
        lessons: course.lessons || [], // Ensure lessons array exists
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

exports.addLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, videoUrl, duration, fileName } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the tutor of the course
    if (course.tutorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add lessons to this course' });
    }

    // Create a new Lesson document
    const lesson = new Lesson({
      title,
      description,
      videoUrl,
      duration,
      order: course.lessons.length + 1,
      course: courseId,
      status: 'processing'
    });

    // Save the lesson
    await lesson.save();

    // Add lesson reference to course
    course.lessons.push(lesson._id);
    await course.save();

    // Start async processing if needed
    processVideo(lesson._id, videoUrl).catch(console.error);

    // Return the populated course
    const updatedCourse = await Course.findById(courseId)
      .populate('tutorId', 'name avatar')
      .populate({
        path: 'lessons',
        options: { sort: { order: 1 } }
      });

    res.status(201).json(updatedCourse);
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ message: 'Error creating lesson', error: error.message });
  }
};

async function processVideo(courseId, lessonId, videoUrl) {
  try {
    // Get video metadata (you'll need to implement this)
    const metadata = { duration: 0 }; // Placeholder
    
    // Transcribe video
    const { transcript, timestamps, captions } = await transcribeVideo(videoUrl);

    // Update lesson with processed data
    await Course.findOneAndUpdate(
      { _id: courseId, 'lessons._id': lessonId },
      {
        $set: {
          'lessons.$.duration': metadata.duration,
          'lessons.$.transcript': transcript,
          'lessons.$.timestamps': timestamps,
          'lessons.$.captions': captions,
          'lessons.$.videoMetadata': metadata,
          'lessons.$.status': 'ready'
        }
      }
    );
  } catch (error) {
    // Update lesson status to failed
    await Course.findOneAndUpdate(
      { _id: courseId, 'lessons._id': lessonId },
      {
        $set: {
          'lessons.$.status': 'failed'
        }
      }
    );
    console.error('Video processing failed:', error);
  }
}
