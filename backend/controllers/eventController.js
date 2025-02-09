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
  //query parameters
  const { category, timeframe, search } = req.query;
  const filters = {};
  if (category && category.trim().length > 0) {
    filters.category = category;
  }
  if (timeframe && timeframe.trim().length > 0) {
    filters.date = timeframe === 'past' ? { $lte: new Date() } : { $gt: new Date() };
  }
  if (search && search.trim().length > 0) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }
  const events = await Event.find(filters).populate('user', 'name email').populate('attendees', 'name email');
  res.json(events.map(event => ({...event.toObject(), attendees: event.attendees.length})));
  // res.json(events);
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

  if (event && event.user.toString() === req.user.id) {
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

  if (event && event.user.toString() === req.user.id) {
    await event.remove();
    res.json({ message: 'Event removed' });
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
};

// Join an event
const joinEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already joined this event' });
    }

    event.attendees.push(req.user.id);
    await event.save();
    res.json({ message: 'Joined event successfully' });
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
};

// Leave an event
const leaveEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    if (!event.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have not joined this event' });
    }

    event.attendees = event.attendees.filter(attendee => attendee.toString() !== req.user.id);
    await event.save();
    res.json({ message: 'Left event successfully' });
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
  joinEvent,
  leaveEvent,
};