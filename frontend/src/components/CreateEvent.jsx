import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserGroupIcon, 
  TagIcon,
  PhotoIcon,
  MapPinIcon,
  PlusCircleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { api } from '../utils/api';
import { Auth } from '../utils/auth';

function CreateEvent() {
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    category: '',
    maxAttendees: '',
    location: '',
    tags: [],
    image: '',
    imageFile: null
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(''); // For image preview
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!eventData.name.trim()) newErrors.name = 'Event name is required';
    if (!eventData.description.trim()) newErrors.description = 'Description is required';
    if (!eventData.date) newErrors.date = 'Date is required';
    if (!eventData.time) newErrors.time = 'Time is required';
    if (!eventData.category) newErrors.category = 'Category is required';
    if (!eventData.maxAttendees) newErrors.maxAttendees = 'Maximum attendees is required';
    if (!eventData.location.trim()) newErrors.location = 'Location is required';
    if (!eventData.image && !eventData.imageFile) newErrors.image = 'Event image is required';
    
    // Validate date is not in the past
    if (eventData.date) {
      const eventDateTime = new Date(`${eventData.date}T${eventData.time || '00:00'}`);
      if (eventDateTime < new Date()) {
        newErrors.date = 'Event date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ ...errors, imageFile: 'Image size should be less than 5MB' });
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, imageFile: 'Please upload a valid image file (JPEG, PNG, or GIF)' });
        return;
      }

      setEventData({ ...eventData, imageFile: file, image: '' }); // Clear URL if file is uploaded
      setPreviewUrl(URL.createObjectURL(file));
      setErrors({ ...errors, imageFile: null, image: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // console.log('Event created:', eventData);
      // navigate('/');
      const formData = new FormData();
      Object.keys(eventData).forEach(key => {
        if (key === 'tags') {
          eventData[key].forEach(tag => formData.append('tags[]', tag));
        } else {
          formData.append(key, eventData[key]);
        }
      });
      formData.set('date', new Date(`${eventData.date}T${eventData.time}`).toISOString());
      formData.delete('image'); // Remove image URL
      formData.delete('imageFile'); // Remove image file
      formData.append('image', eventData.imageFile); // Add image file
      api.createEvent(formData, Auth.getUser().token).then(() => {
        navigate('/');
      }).catch((error) => {
        console.error('Error creating event:', error);
      });
    } else {
      // Scroll to first error
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (currentTag && !eventData.tags.includes(currentTag)) {
      setEventData({
        ...eventData,
        tags: [...eventData.tags, currentTag]
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setEventData({
      ...eventData,
      tags: eventData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(e);
    }
  };

  const formSections = [
    {
      title: "Basic Information",
      fields: [
        {
          label: "Event Name",
          type: "text",
          value: eventData.name,
          onChange: (e) => setEventData({ ...eventData, name: e.target.value }),
          placeholder: "Enter event name",
          required: true,
          icon: null,
          error: errors.name,
          tooltip: "Choose a clear and descriptive name for your event"
        },
        {
          label: "Description",
          type: "textarea",
          value: eventData.description,
          onChange: (e) => setEventData({ ...eventData, description: e.target.value }),
          placeholder: "Describe your event",
          required: true,
          icon: null,
          rows: 4,
          error: errors.description,
          tooltip: "Provide detailed information about your event"
        }
      ]
    },
    {
      title: "Date and Time",
      fields: [
        {
          label: "Date",
          type: "date",
          value: eventData.date,
          onChange: (e) => setEventData({ ...eventData, date: e.target.value }),
          required: true,
          icon: CalendarIcon,
          error: errors.date,
          tooltip: "Select the date of your event"
        },
        {
          label: "Time",
          type: "time",
          value: eventData.time,
          onChange: (e) => setEventData({ ...eventData, time: e.target.value }),
          required: true,
          icon: ClockIcon,
          error: errors.time,
          tooltip: "Choose the start time of your event"
        }
      ]
    },
    {
      title: "Event Details",
      fields: [
        {
          label: "Category",
          type: "select",
          value: eventData.category,
          onChange: (e) => setEventData({ ...eventData, category: e.target.value }),
          required: true,
          error: errors.category,
          tooltip: "Select the category that best fits your event",
          options: [
            { value: "", label: "Select a category" },
            { value: "Technology", label: "Technology" },
            { value: "Music", label: "Music" },
            { value: "Sports", label: "Sports" },
            { value: "Business", label: "Business" },
            { value: "Art", label: "Art" }
          ]
        },
        {
          label: "Maximum Attendees",
          type: "number",
          value: eventData.maxAttendees,
          onChange: (e) => setEventData({ ...eventData, maxAttendees: e.target.value }),
          required: true,
          min: "1",
          icon: UserGroupIcon,
          error: errors.maxAttendees,
          tooltip: "Set the maximum number of attendees for your event"
        }
      ]
    }
  ];

  const renderField = (field) => {
    const baseClasses = "w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";
    const errorClasses = field.error ? "border-red-300 focus:ring-red-500" : "";
    
    return (
      <div className="relative" data-error={field.error ? "true" : "false"}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            {field.icon && <field.icon className="w-5 h-5 text-gray-400" />}
            {field.label}
            {field.tooltip && (
              <div className="group relative">
                <InformationCircleIcon className="w-5 h-5 text-gray-400 cursor-help" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                  {field.tooltip}
                </div>
              </div>
            )}
          </div>
        </label>

        {field.type === 'textarea' ? (
          <textarea
            className={`${baseClasses} ${errorClasses}`}
            rows={field.rows}
            value={field.value}
            onChange={field.onChange}
            placeholder={field.placeholder}
            required={field.required}
          />
        ) : field.type === 'select' ? (
          <select
            className={`${baseClasses} ${errorClasses}`}
            value={field.value}
            onChange={field.onChange}
            required={field.required}
          >
            {field.options.map((option, optionIndex) => (
              <option key={optionIndex} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : field.type === 'file' ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-indigo-500 transition-colors">
                <PhotoIcon className="w-12 h-12 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Click to upload image</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={field.onChange}
                  required={field.required}
                />
              </label>
            </div>
            {previewUrl && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl('');
                    setEventData({ ...eventData, imageFile: null });
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        ) : (
          <input
            type={field.type}
            className={`${baseClasses} ${errorClasses}`}
            value={field.value}
            onChange={field.onChange}
            placeholder={field.placeholder}
            required={field.required}
            min={field.min}
          />
        )}

        {field.error && (
          <div className="absolute right-0 top-0 mt-2 mr-2 text-red-500">
            <ExclamationCircleIcon className="w-5 h-5" />
          </div>
        )}
        
        {field.error && (
          <p className="mt-1 text-sm text-red-600">{field.error}</p>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mb-12"
    >
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create New Event</h2>
          <p className="text-gray-600 mt-2">Fill in the details to create your event</p>
        </div>
        
        <div className="flex gap-8">
          <form onSubmit={handleSubmit} className="flex-1 space-y-8">
            {formSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">{section.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Location & Media</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {renderField({
                    label: "Location",
                    type: "text",
                    value: eventData.location,
                    onChange: (e) => setEventData({ ...eventData, location: e.target.value }),
                    placeholder: "Enter event location",
                    required: true,
                    icon: MapPinIcon,
                    error: errors.location,
                    tooltip: "Specify where your event will take place"
                  })}
                </div>

                <div>
                  {renderField({
                    label: "Upload Image",
                    type: "file",
                    onChange: handleImageChange,
                    required: true,
                    icon: PhotoIcon,
                    error: errors.imageFile || errors.image,
                    tooltip: "Upload an image for your event (max 5MB, JPEG/PNG/GIF)"
                  })}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Tags</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                <AnimatePresence>
                  {eventData.tags.map(tag => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        ×
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag (press Enter)"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors duration-200 flex items-center gap-2"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  Add Tag
                </button>
              </div>
            </motion.div>

            <div className="flex gap-4 justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center gap-2"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  Create Event
                </button>
              </div>
            </div>
          </form>

          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-96 sticky top-8 h-fit"
              >
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Event Preview</h3>
                  
                  {eventData.image && (
                    <img
                      src={eventData.image}
                      alt="Event preview"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">{eventData.name || 'Event Name'}</h4>
                      <p className="text-sm text-gray-600">
                        {eventData.description || 'Event description will appear here'}
                      </p>
                    </div>
                    
                    {(eventData.date || eventData.time) && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {eventData.date} {eventData.time}
                      </div>
                    )}
                    
                    {eventData.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        {eventData.location}
                      </div>
                    )}
                    
                    {eventData.maxAttendees && (
                      <div className="flex items-center text-sm text-gray-600">
                        <UserGroupIcon className="w-4 h-4 mr-2" />
                        Max Attendees: {eventData.maxAttendees}
                      </div>
                    )}
                    
                    {eventData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {eventData.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default CreateEvent;