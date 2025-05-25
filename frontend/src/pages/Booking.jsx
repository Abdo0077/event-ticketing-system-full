import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import axios from 'axios';

const Booking = () => {
    const [event, setEvent] = useState(null);
    const [numberOfTickets, setNumberOfTickets] = useState(1);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/v1/bookings', {
                event: eventId,
                numberOfTickets: numberOfTickets
            }, {
                withCredentials: true
            });

            if (response.data) {
                navigate('/booking-success');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to book tickets');
        }
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
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-6">Book Tickets</h1>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                    <p className="text-gray-600">{event.description}</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Number of Tickets
                        </label>
                        <input
                            type="number"
                            min="1"
                            max={event.remainingTickets}
                            value={numberOfTickets}
                            onChange={(e) => setNumberOfTickets(parseInt(e.target.value))}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-6">
                        <p className="text-lg font-semibold">
                            Total Price: ${(numberOfTickets * event.ticketPrice).toFixed(2)}
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
                    >
                        Confirm Booking
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Booking; 