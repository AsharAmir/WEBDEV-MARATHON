const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');

// Get messages for a course
const getCourseMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ courseId: req.params.courseId })
      .sort({ timestamp: 1 })
      .populate('userId', 'name avatar');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { userId, courseId, content } = req.body;

    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new message
    const message = new ChatMessage({
      userId,
      userName: user.name,
      userAvatar: user.avatar,
      courseId,
      content
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
  try {
    const message = await ChatMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
};

module.exports = {
  getCourseMessages,
  sendMessage,
  deleteMessage
}; 