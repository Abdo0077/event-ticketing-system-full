import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div 
      onClick={() => navigate(`/events/${event._id}`)}
      className="bg-white rounded shadow hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col border border-gray-100"
    >
      {event.image && (
        <div className="h-28 overflow-hidden bg-gray-100">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-2 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold mb-1 text-gray-800 line-clamp-2 min-h-[36px]">
          {event.title}
        </h3>
        <div className="space-y-1 flex-grow">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium text-[15px] text-gray-700 truncate">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate text-xs">{event.location}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold text-blue-700 text-[17px]">
            ${event.ticketPrice.toFixed(2)}
          </span>
          {event.remainingTickets <= 10 && event.remainingTickets > 0 && (
            <span className="text-[11px] text-orange-600 font-medium">
              {event.remainingTickets} left
            </span>
          )}
          {event.remainingTickets === 0 && (
            <span className="text-[11px] text-red-600 font-medium">
              Sold out
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    ticketPrice: PropTypes.number.isRequired,
    image: PropTypes.string,
    remainingTickets: PropTypes.number.isRequired,
  }).isRequired,
};

export default EventCard; 