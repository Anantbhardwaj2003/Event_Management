const mongoose = require('mongoose');

/*
  Event Schema

  {
      name: 'Tech Conference 2024',
      description: 'Join industry leaders for a day of innovation and networking. Featuring keynote speakers from top tech companies.',
      date: '2024-04-15',
      time: '09:00',
      category: 'Technology',
      attendees: ['John Doe', 'Jane Smith'],
      location: 'Convention Center',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      tags: ['AI', 'Web3', 'Cloud']
    },

*/

const eventSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add an event name'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    image: {
      type: String,
    },
    tags: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;