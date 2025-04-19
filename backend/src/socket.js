const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const ChatMessage = require('./models/ChatMessage');
const User = require('./models/User');

function initializeSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      console.log('Socket connection attempt with token:', token ? 'Token present' : 'No token');

      if (!token) {
        console.error('No token provided in socket connection');
        return next(new Error('Authentication token is required'));
      }

      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', decoded);

      if (!decoded.userId) {
        console.error('No userId found in decoded token');
        return next(new Error('Invalid token: no user ID found'));
      }

      // Find the user in the database
      const user = await User.findById(decoded.userId);
      if (!user) {
        console.error('User not found in database:', decoded.userId);
        return next(new Error('User not found'));
      }

      // Attach user data to socket
      socket.userId = decoded.userId;
      socket.user = {
        id: user._id,
        name: user.name,
        role: user.role
      };

      console.log('Socket authenticated for user:', {
        id: socket.userId,
        name: socket.user.name,
        role: socket.user.role
      });

      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      return next(new Error('Authentication failed: ' + error.message));
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', {
      socketId: socket.id,
      userId: socket.userId,
      userName: socket.user?.name
    });

    socket.on('joinCourseChat', async (courseId) => {
      try {
        // Join the course room
        socket.join(`course:${courseId}`);
        console.log(`User ${socket.user.name} joined course chat: ${courseId}`);

        // Send chat history
        const messages = await ChatMessage.find({ courseId })
          .sort({ createdAt: 1 })
          .populate('userId', 'name avatar');
        
        console.log('Sending chat history:', messages.length, 'messages');
        socket.emit('chatHistory', messages);
      } catch (error) {
        console.error('Error joining course chat:', error);
        socket.emit('error', { message: 'Error joining course chat' });
      }
    });

    socket.on('sendMessage', async ({ courseId, content }) => {
      if (!socket.userId) {
        console.error('No user ID found on socket');
        return;
      }

      console.log('New message received:', {
        courseId,
        content,
        userId: socket.userId
      });

      try {
        // Save message to database
        const message = await ChatMessage.create({
          courseId,
          userId: socket.userId,
          content
        });

        // Populate sender information
        await message.populate('userId', 'name avatar');

        // Broadcast message to all users in the course chat
        io.to(`course:${courseId}`).emit('newMessage', message);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', { message: 'Failed to save message' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', {
        socketId: socket.id,
        userId: socket.userId,
        userName: socket.user?.name
      });
    });
  });

  return io;
}

module.exports = initializeSocket;