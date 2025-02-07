const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Route to create a new event (protected route)
router.post('/', protect, upload.single('image'), createEvent);

// Route to get all events
router.get('/', getEvents);

// Route to get a single event by ID
router.get('/:id', getEventById);

// Route to update an event (protected route)
router.put('/:id', protect, upload.single('image'), updateEvent);

// Route to delete an event (protected route)
router.delete('/:id', protect, deleteEvent);

module.exports = router;