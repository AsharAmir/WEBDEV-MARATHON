const express = require('express');
const router = express.Router();
const { 
  getCourseMessages, 
  sendMessage, 
  deleteMessage 
} = require('../controllers/chatController');

// Get messages for a course
router.get('/course/:courseId', getCourseMessages);

// Send a new message
router.post('/', sendMessage);

// Delete a message
router.delete('/:id', deleteMessage);

module.exports = router;