import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarIcon, UserGroupIcon, MapPinIcon, TagIcon } from '@heroicons/react/24/outline';
import { api } from '../utils/api';

function EventDashboard() {
  const [filter, setFilter] = useState({ category: '', timeFrame: 'upcoming', search: '' });
  const [filteredEvents, setFilteredEvents] = useState([]);
  // Enhanced mock data with more realistic events
  // const events = [
  //   {
  //     id: 1,
  //     name: 'Tech Conference 2024',
  //     description: 'Join industry leaders for a day of innovation and networking. Featuring keynote speakers from top tech companies.',
  //     date: '2024-04-15',
  //     time: '09:00',
  //     category: 'Technology',
  //     attendees: 120,
  //     location: 'Convention Center',
  //     image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  //     tags: ['AI', 'Web3', 'Cloud']
  //   },
  //   {
  //     id: 2,
  //     name: 'Summer Music Festival',
  //     description: 'Experience an unforgettable day of live music performances across multiple stages featuring both established and emerging artists.',
  //     date: '2024-07-01',
  //     time: '14:00',
  //     category: 'Music',
  //     attendees: 500,
  //     location: 'Central Park',
  //     image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  //     tags: ['Live Music', 'Festival', 'Summer']
  //   },
  //   {
  //     id: 3,
  //     name: 'Business Leadership Summit',
  //     description: 'Connect with business leaders and learn about the latest trends in management, leadership, and innovation.',
  //     date: '2024-05-20',
  //     time: '10:00',
  //     category: 'Business',
  //     attendees: 250,
  //     location: 'Grand Hotel',
  //     image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  //     tags: ['Leadership', 'Networking', 'Innovation']
  //   }
  // ];

  useEffect(() => {
    api.getEvents(filter.search, filter.category, filter.timeFrame).then(events => {
      console.log('Events loaded:', events);
      setFilteredEvents(events);
    }).catch(error => {
      console.error('Error loading events:', error);
    });
  }, [filter]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Discover Events</h1>
          <Link
            to="/create-event"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
          >
            <span className="text-lg">Create Event</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search events..."
            className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
          <select
            className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Music">Music</option>
            <option value="Sports">Sports</option>
            <option value="Business">Business</option>
            <option value="Art">Art</option>
          </select>
          <select
            className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            value={filter.timeFrame}
            onChange={(e) => setFilter({ ...filter, timeFrame: e.target.value })}
          >
            <option value="upcoming">Upcoming Events</option>
            <option value="past">Past Events</option>
          </select>
        </div>
      </div>

      <motion.div 
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredEvents.map(event => (
          <motion.div
            key={event.id}
            variants={item}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-48">
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-600">
                  {event.category}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-500">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  <span>{format(new Date(event.date), 'MMM dd, yyyy')} at {format(new Date(event.date), 'HH:mm')}</span>
                </div>
                
                <div className="flex items-center text-gray-500">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  <span>{event.location}</span>
                </div>
                
                <div className="flex items-center text-gray-500">
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  <span>{event.attendees} attendees</span>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {event.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    <TagIcon className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
              
              <button className="mt-6 w-full bg-indigo-50 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-100 transition-colors duration-200">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {filteredEvents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 text-xl">No events found matching your criteria</div>
        </motion.div>
      )}
    </div>
  );
}

export default EventDashboard