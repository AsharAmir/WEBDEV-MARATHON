const jwt = require('jsonwebtoken');
const Chat = require('../models/Chat');

function initializeSocket(io) {
  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      // Decode the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Set userId from the decoded token
      // The issue is here - you're using decoded.id but your token has userId
      socket.userId = decoded.userId; // Changed from decoded.id to decoded.userId
      next();
    } catch (err) {
      console.error('Socket authentication error:', err);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);

    // Join course chat room
    socket.on('joinCourseChat', async (courseId) => {
      try {
        // Join the room
        socket.join(course:${courseId});

        // Get or create chat for this course
        let chat = await Chat.findOne({ course: courseId })
          .populate('messages.sender', 'name email')
          .populate('participants', 'name email');

        if (!chat) {
          chat = new Chat({
            course: courseId,
            participants: [socket.userId],
            messages: []
          });
          await chat.save();
        } else if (!chat.participants.some(p => p._id.toString() === socket.userId)) {
          chat.participants.push(socket.userId);
          await chat.save();
        }

        // Send chat history to the user
        socket.emit('chatHistory', chat.messages);
      } catch (error) {
        console.error('Error joining chat:', error);
        socket.emit('error', { message: 'Error joining chat' });
      }
    });

    // Handle new messages
    socket.on('sendMessage', async (data) => {
      try {
        const { courseId, content } = data;
        const chat = await Chat.findOne({ course: courseId });
        
        if (!chat) {
          throw new Error('Chat not found');
        }

        const newMessage = {
          sender: socket.userId,
          content,
          timestamp: new Date()
        };

        chat.messages.push(newMessage);
        await chat.save();

        // Populate sender info before broadcasting
        const populatedChat = await Chat.findById(chat._id)
          .populate('messages.sender', 'name email');
        
        const populatedMessage = populatedChat.messages[populatedChat.messages.length - 1];

        // Broadcast the message to all users in the course chat room
        io.to(course:${courseId}).emit('newMessage', populatedMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Error sending message' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });
  });

  return io;
}

module.exports = initializeSocket;