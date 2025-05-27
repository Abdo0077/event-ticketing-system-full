import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventService } from '../services/api';
import { useAuth } from '../auth/AuthContext';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user?.role !== 'Organizer') {
            navigate('/');
            return;
        }
        fetchEvents();
    }, [user, navigate]);

    const fetchEvents = async () => {
        try {
            const response = await eventService.getMyEvents();
            setEvents(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        
        try {
            await eventService.deleteEvent(eventId);
            setEvents(events.filter(event => event._id !== eventId));
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

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'declined':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Events</h1>
                <div className="flex gap-4">
                    <Link
                        to="/event-analytics"
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        View Analytics
                    </Link>
                    <Link
                        to="/create-event"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Create New Event
                    </Link>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img
                            src={event.image || 'https://via.placeholder.com/400x200'}
                            alt={event.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-semibold">{event.title}</h2>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(event.status)}`}>
                                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                            <div className="flex flex-col space-y-2 text-sm text-gray-500">
                                <div>Date: {new Date(event.date).toLocaleDateString()}</div>
                                <div>Location: {event.location}</div>
                                <div>Price: ${event.ticketPrice}</div>
                                <div>Available Tickets: {event.remainingTickets}/{event.totalTickets}</div>
                            </div>
                            <div className="mt-4 flex justify-between gap-2">
                                <Link
                                    to={`/edit-event/${event._id}`}
                                    className="flex-1 text-center bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(event._id)}
                                    className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {events.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    No events found. Create your first event!
                </div>
            )}
        </div>
    );
};

export default MyEvents; 