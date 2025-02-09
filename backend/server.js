const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const Event = require('./models/eventModel'); // Import Event model
const jwt = require('jsonwebtoken'); // Import JWT for token verification

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

// Socket.IO setup
const socketUserMap = new Map();

io.on('connection', (socket) => {
  console.log('a user connected');

  // Authenticate user and store user ID in the map
  socket.on('authenticate', (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socketUserMap.set(socket.id, decoded.id);
      console.log(`User ${decoded.id} authenticated with socket ID ${socket.id}`);
    } catch (error) {
      console.error('Authentication error:', error);
    }
  });

  socket.on('joinEvent', async (eventId) => {
    const userId = socketUserMap.get(socket.id);
    if (!userId) {
      return socket.emit('error', { message: 'User not authenticated' });
    }

    const event = await Event.findById(eventId);
    if (event) {
      if (event.attendees.includes(userId)) {
        return socket.emit('error', { message: 'You have already joined this event' });
      }

      event.attendees.push(userId);
      await event.save();
      io.emit('eventUpdated', { eventId: event._id, attendees: event.attendees.length });
    } else {
      socket.emit('error', { message: 'Event not found' });
    }
  });

  socket.on('leaveEvent', async (eventId) => {
    const userId = socketUserMap.get(socket.id);
    if (!userId) {
      return socket.emit('error', { message: 'User not authenticated' });
    }

    const event = await Event.findById(eventId);
    if (event) {
      event.attendees = event.attendees.filter(id => id !== userId);
      await event.save();
      io.emit('eventUpdated', { eventId: event._id, attendees: event.attendees.length });
    } else {
      socket.emit('error', { message: 'Event not found' });
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    socketUserMap.delete(socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});