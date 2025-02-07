const Event = require('../models/eventModel');

// Create a new event
const createEvent = async (req, res) => {
  const { name, description, date, category, location, tags } = req.body;
  const image = req.file ? req.file.path : null;

  if (!name || !description || !date || !category || !location) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  const event = new Event({
    user: req.user.id,
    name,
    description,
    date,
    category,
    location,
    image,
    tags,
  });

  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
};

// Get all events
const getEvents = async (req, res) => {
  const events = await Event.find().populate('user', 'name email').populate('attendees', 'name email');
  res.json(events);
};

// Get a single event by ID
const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id).populate('user', 'name email').populate('attendees', 'name email');

  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
};

// Update an event
const updateEvent = async (req, res) => {
  const { name, description, date, category, location, tags } = req.body;
  const image = req.file ? req.file.path : null;

  const event = await Event.findById(req.params.id);

  if (event) {
    event.name = name || event.name;
    event.description = description || event.description;
    event.date = date || event.date;
    event.category = category || event.category;
    event.location = location || event.location;
    event.image = image || event.image;
    event.tags = tags || event.tags;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    await event.remove();
    res.json({ message: 'Event removed' });
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};