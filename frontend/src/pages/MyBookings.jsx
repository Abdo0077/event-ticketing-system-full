import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const fetchBookings = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/users/bookings', {
                withCredentials: true
            });

            if (response.data && response.data.success && Array.isArray(response.data.bookings)) {
                setBookings(response.data.bookings);
            } else {
                setError('Invalid response format from server');
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError(err.response?.data?.message || 'Failed to fetch bookings. Please try again later.');
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            await axios.delete(`http://localhost:3000/api/v1/bookings/${bookingId}`, {
                withCredentials: true
            });
            // Refresh the bookings list after cancellation
            fetchBookings();
        } catch (err) {
            console.error('Error cancelling booking:', err);
            setError(err.response?.data?.message || 'Failed to cancel booking. Please try again later.');
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-4">My Bookings</h1>
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-4">My Bookings</h1>
                    <p className="text-gray-600">You haven't made any bookings yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">My Bookings</h1>
            <div className="max-w-4xl mx-auto space-y-6">
                {bookings.map((booking) => (
                    <div key={booking._id} className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">{booking.event.title}</h2>
                                <p className="text-gray-600 mb-2">{booking.event.description}</p>
                                <div className="space-y-1">
                                    <p><span className="font-semibold">Date:</span> {new Date(booking.event.date).toLocaleDateString()}</p>
                                    <p><span className="font-semibold">Location:</span> {booking.event.location}</p>
                                    <p><span className="font-semibold">Number of Tickets:</span> {booking.numberOfTickets}</p>
                                    <p><span className="font-semibold">Total Price:</span> ${booking.totalPrice}</p>
                                    <p><span className="font-semibold">Booking Date:</span> {new Date(booking.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {booking.status || 'Confirmed'}
                                </div>
                                {booking.status === 'confirmed' && (
                                    <button
                                        onClick={() => handleCancelBooking(booking._id)}
                                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300"
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBookings; 