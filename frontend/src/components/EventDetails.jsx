import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Users, MapPin, Tag, ArrowLeft, Share2, Heart, MessageSquare } from 'lucide-react';
import { api } from '../utils/api';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(id)
    if (id) {
      api.getEventById(id)
        .then(eventData => {
          setEvent(eventData);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error loading event:', error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
        <Link to="/" className="mt-4 text-indigo-600 hover:text-indigo-800">
          Return to Events
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="relative h-96">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <Link
          to="/"
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{event.name}</h1>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {event.category}
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <Share2 className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <Heart className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-6 h-6 mr-3" />
            <div>
              <p className="font-medium">{format(new Date(event.date), 'MMMM dd, yyyy')}</p>
              <p>{event.time}</p>
            </div>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="w-6 h-6 mr-3" />
            <div>
              <p className="font-medium">{event.location}</p>
              <p>Venue</p>
            </div>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Users className="w-6 h-6 mr-3" />
            <div>
              <p className="font-medium">{event.attendees} people</p>
              <p>Attending</p>
            </div>
          </div>
        </div>

        <div className="prose max-w-none mb-8">
          <h2 className="text-2xl font-semibold mb-4">About this event</h2>
          <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {event.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                <Tag className="w-4 h-4 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="flex justify-between items-center">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
              Register for Event
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <MessageSquare className="w-5 h-5" />
              Contact Organizer
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default EventDetails;