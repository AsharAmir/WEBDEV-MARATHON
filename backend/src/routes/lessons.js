const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/auth');
const lessonController = require('../controllers/lessonController');

// Configure multer for video upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/lessons');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept video files only
    if (!file.originalname.match(/\.(mp4|mov|avi|wmv)$/)) {
      return cb(new Error('Only video files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max file size
  }
});

// Create a new lesson
router.post('/courses/:courseId/lessons', auth, upload.single('video'), lessonController.createLesson);

// Get lesson details
router.get('/lessons/:lessonId', auth, lessonController.getLesson);

// Delete a lesson
router.delete('/lessons/:lessonId', auth, lessonController.deleteLesson);

module.exports = router; 