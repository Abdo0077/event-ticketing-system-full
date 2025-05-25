import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/api';
import { useAuth } from '../auth/AuthContext';

const EventDetails = () => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { eventId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await eventService.getEventById(eventId);
                setEvent(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch event details');
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [eventId]);

    const handleBookNow = () => {
        // TODO: Implement booking logic
        navigate(`/booking/${eventId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                Error: {error}
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center p-4">
                Event not found
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-96 object-cover"
                />
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Event Details</h2>
                            <p className="text-gray-600 mb-4">{event.description}</p>
                            <div className="space-y-2">
                                <p><span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString()}</p>
                                <p><span className="font-semibold">Location:</span> {event.location}</p>
                                <p><span className="font-semibold">Category:</span> {event.category}</p>
                                <p><span className="font-semibold">Price:</span> ${event.ticketPrice}</p>
                                <p><span className="font-semibold">Available Tickets:</span> {event.remainingTickets}</p>
                            </div>
                        </div>
                    </div>
                    {user && user.role === 'Standard User' && event.remainingTickets > 0 && (
                        <button
                            onClick={handleBookNow}
                            className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                        >
                            Book Now
                        </button>
                    )}
                    {user && user.role === 'user' && event.remainingTickets === 0 && (
                        <div className="text-center text-red-600 font-semibold">
                            Sorry, this event is sold out!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetails; 