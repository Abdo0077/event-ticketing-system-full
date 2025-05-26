import React from 'react';
import { Link } from 'react-router-dom';

const BookingSuccess = () => {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
                <div className="mb-8">
                    <svg
                        className="mx-auto h-16 w-16 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold mb-4">Booking Successful!</h1>
                <p className="text-gray-600 mb-8">
                    Your tickets have been booked successfully. You can view your booking details in your profile.
                </p>
                <div className="space-x-4">
                    <Link
                        to="/my-bookings"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-300"
                    >
                        View My Bookings
                    </Link>
                    <Link
                        to="/"
                        className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors duration-300"
                    >
                        Browse More Events
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess; 