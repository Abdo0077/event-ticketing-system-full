import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-2">{event.description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                        ${event.ticketPrice}
                    </span>
                </div>
                <Link
                    to={`/events/${event._id}`}
                    className="mt-4 block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default EventCard; 