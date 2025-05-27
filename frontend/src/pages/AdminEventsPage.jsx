import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { eventService } from '../services/api';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'System Admin') {
      navigate('/');
      return;
    }

    fetchEvents();
  }, [user, navigate]);

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAllEventsAdmin();
      setEvents(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    try {
      await eventService.approveEvent(eventId);
      setEvents(events.map(event => 
        event._id === eventId ? { ...event, status: 'approved' } : event
      ));
      setSuccessMessage('Event approved successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve event');
    }
  };

  const handleDecline = async (eventId) => {
    if (!window.confirm('Are you sure you want to decline this event?')) return;
    
    try {
      await eventService.declineEvent(eventId);
      setEvents(events.map(event => 
        event._id === eventId ? { ...event, status: 'declined' } : event
      ));
      setSuccessMessage('Event declined successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to decline event');
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await eventService.deleteEvent(eventId);
      setEvents(events.filter(event => event._id !== eventId));
      setSuccessMessage('Event deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Events</h1>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {events.map(event => (
          <div key={event._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-2">{event.description}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>Date: {new Date(event.date).toLocaleDateString()}</span>
                  <span>Time: {new Date(event.date).toLocaleTimeString()}</span>
                  <span>Venue: {event.venue}</span>
                  <span>Price: ${event.ticketPrice}</span>
                  <span>Available Tickets: {event.availableTickets}</span>
                  <span className={`font-semibold ${
                    event.status === 'approved' ? 'text-green-600' :
                    event.status === 'declined' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    Status: {event.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {event.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(event._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecline(event._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Decline
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(event._id)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEventsPage; 