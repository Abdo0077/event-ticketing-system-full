import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/api';
import { useAuth } from '../auth/AuthContext';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('pending');
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user?.role !== 'System Admin') {
            navigate('/');
            return;
        }
        fetchEvents();
    }, [user, navigate]);

    const fetchEvents = async () => {
        try {
            const response = await eventService.getAllEvents();
            setEvents(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (eventId) => {
        try {
            await eventService.updateEventStatus(eventId, { status: 'approved' });
            setEvents(events.map(event => 
                event._id === eventId ? { ...event, status: 'approved' } : event
            ));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to approve event');
        }
    };

    const handleDecline = async (eventId) => {
        if (!window.confirm('Are you sure you want to decline and delete this event? This action cannot be undone.')) {
            return;
        }

        try {
            // First decline the event
            await eventService.updateEventStatus(eventId, { status: 'declined' });
            // Then delete it
            await eventService.deleteEvent(eventId);
            // Remove from local state
            setEvents(events.filter(event => event._id !== eventId));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to decline and delete event');
        }
    };

    const filteredEvents = events.filter(event => filter === 'all' || event.status === filter);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Event Management</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
                    <span>{error}</span>
                    <button 
                        onClick={() => setError(null)}
                        className="text-red-700 hover:text-red-900"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter Events</label>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="all">All Events</option>
                    <option value="pending">Pending Approval</option>
                    <option value="approved">Approved</option>
                </select>
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
                                Date & Tickets
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredEvents.map((event) => (
                            <tr key={event._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-20 w-20">
                                            <img
                                                className="h-20 w-20 rounded-lg object-cover"
                                                src={event.image || 'https://via.placeholder.com/80'}
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {event.title}
                                            </div>
                                            <div className="text-sm text-gray-500 line-clamp-2">
                                                {event.description}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {event.location}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">
                                        {event.organizer.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {event.organizer.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">
                                        {new Date(event.date).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Price: ${event.ticketPrice}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Available: {event.remainingTickets}/{event.totalTickets}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${event.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                        'bg-yellow-100 text-yellow-800'}`}>
                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {event.status === 'pending' ? (
                                        <div className="flex flex-col space-y-2">
                                            <button
                                                onClick={() => handleApprove(event._id)}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                Approve & Publish
                                            </button>
                                            <button
                                                onClick={() => handleDecline(event._id)}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                Decline & Delete
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500 italic">
                                            No actions available
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredEvents.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        No events found with the selected filter.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminEvents; 