import React, { useState } from 'react';
import api from '../services/api';

const BookTicketForm = ({ event, onBookingComplete }) => {
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/bookings`, {
        eventId: event._id,
        numberOfTickets,
      });

      setLoading(false);
      if (onBookingComplete) {
        onBookingComplete(response.data);
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to book tickets. Please try again.');
    }
  };

  if (event.remainingTickets === 0) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Sorry, this event is sold out!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="numberOfTickets" className="block text-sm font-medium text-gray-700">
          Number of Tickets
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="number"
            id="numberOfTickets"
            min="1"
            max={event.remainingTickets}
            value={numberOfTickets}
            onChange={(e) => setNumberOfTickets(parseInt(e.target.value))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-500">
            (Max: {event.remainingTickets})
          </span>
        </div>
      </div>

      <div className="text-lg font-semibold">
        Total: ${(numberOfTickets * event.ticketPrice).toFixed(2)}
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || numberOfTickets < 1}
        className={`w-full rounded-md px-4 py-2 text-white ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Booking...' : 'Book Tickets'}
      </button>
    </form>
  );
};

export default BookTicketForm; 