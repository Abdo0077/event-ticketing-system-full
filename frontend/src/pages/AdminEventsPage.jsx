import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminEventsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admins away immediately
  useEffect(() => {
    if (!user || user.role !== 'System Admin') {
      navigate('/'); // Redirect to home or another safe page
    }
  }, [user, navigate]);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [eventNotes, setEventNotes] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (eventId, status) => {
    const note = eventNotes[eventId] || '';
    console.log(`Event ${eventId} status: ${status}, note: ${note}`);
    try {
      let result;
      if (status === 'approved') {
        result = await eventService.approveEvent(eventId);
      } else if (status === 'declined') {
        result = await eventService.disapproveEvent(eventId);
      } else {
        result = await eventService.updateEventStatus(eventId, status);
      }

      if (result.event) {
        if (result.event.status === 'declined') {
          setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
        } else {
          setEvents(prevEvents => prevEvents.map(event =>
            event._id === eventId ? { ...event, status: result.event.status } : event
          ));
        }
        setError(null); // Clear any previous errors
      } else if (result.deleted) {
        setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
        setError(null);
      } else {
        setError('Failed to update event status: Invalid response from server');
      }
    } catch (err) {
      if (err.status === 403 || err.message?.toLowerCase().includes('unauthorized')) {
        setError('You are not authorized to perform this action. Please log in as a System Admin.');
      } else {
        setError(err.message || 'Failed to update event status. Please try again.');
      }
    }
  };

  const handleNoteChange = (eventId, value) => {
    setEventNotes(prev => ({
      ...prev,
      [eventId]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  const renderActionButtons = (event) => {
    if (user?.role !== 'System Admin') return null;

    const manageButton = (
      <button
        onClick={() => navigate(`/manage-events/${event._id}`)}
        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors border border-black"
      >
        Manage
      </button>
    );

    // Input for note
    const noteInput = (
      <input
        type="text"
        placeholder="Type approved or disapproved..."
        value={eventNotes[event._id] || ''}
        onChange={e => handleNoteChange(event._id, e.target.value)}
        className="px-2 py-1 border rounded-md text-sm mr-2"
        style={{ minWidth: 180 }}
      />
    );

    if (event.status === 'pending') {
      return (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusChange(event._id, 'approved')}
              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition-colors border border-black"
            >
              Accept
            </button>
            <button
              onClick={() => handleStatusChange(event._id, 'declined')}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors border border-black"
            >
              Decline
            </button>
            {manageButton}
          </div>
          {noteInput}
        </div>
      );
    }

    if (event.status === 'approved') {
      return (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md">
              Approved
            </span>
            <button
              onClick={() => handleStatusChange(event._id, 'declined')}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors border border-black"
            >
              Decline
            </button>
            {manageButton}
          </div>
          {noteInput}
        </div>
      );
    }

    if (event.status === 'declined') {
      return (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusChange(event._id, 'approved')}
              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition-colors border border-black"
            >
              Approve
            </button>
            {manageButton}
          </div>
          {noteInput}
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
        <p className="mt-2 text-gray-600">Review and manage upcoming events</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Events
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-md ${
            filter === 'pending'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-md ${
            filter === 'approved'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter('declined')}
          className={`px-4 py-2 rounded-md ${
            filter === 'declined'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Declined
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organizer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No events found matching the selected filter.
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {event.image && (
                        <img
                          src={event.image}
                          alt=""
                          className="h-10 w-10 rounded-md object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-md">
                          {event.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {event.organizer?.name || 'Unknown Organizer'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{formatDate(event.date)}</div>
                    <div className="text-sm text-gray-500">{event.location}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        event.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : event.status === 'declined'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {renderActionButtons(event)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEventsPage; 