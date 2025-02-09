const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent, joinEvent, leaveEvent } = require('../controllers/eventController');
const { protect, includeUser } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Route to create a new event (protected route)
router.post('/', protect, upload.single('image'), createEvent);

// Route to get all events
router.get('/', getEvents);

// Route to get a single event by ID
router.get('/:id',includeUser, getEventById);

// Route to update an event (protected route)
router.put('/:id', protect, upload.single('image'), updateEvent);

// Route to delete an event (protected route)
router.delete('/:id', protect, deleteEvent);

// Route to join an event (protected route)
router.put('/:id/join', protect, joinEvent);

// Route to leave an event (protected route)
router.put('/:id/leave', protect, leaveEvent);

module.exports = router;