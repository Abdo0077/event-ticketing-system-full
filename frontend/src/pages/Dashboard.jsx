import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const isOrganizer = user?.role === 'Organizer';
  const isAdmin = user?.role === 'System Admin';

  const OrganizerDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Create Event Card */}
      <Link
        to="/events/create"
        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create Event</h2>
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <p className="text-gray-600">Create and publish a new event for your audience.</p>
      </Link>

      {/* My Events Card */}
      <Link
        to="/my-events"
        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">My Events</h2>
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <p className="text-gray-600">Manage and monitor your created events.</p>
      </Link>

      {/* Analytics Card */}
      <Link
        to="/analytics"
        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Event Analytics</h2>
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="text-gray-600">View detailed analytics and insights for your events.</p>
      </Link>
    </div>
  );

  const AdminDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Manage Events Card */}
      <Link
        to="/manage-events"
        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Manage Events</h2>
          <svg
            className="w-6 h-6 text-purple-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-gray-600">Review and manage all events in the system.</p>
      </Link>

      {/* View All Events Card */}
      <Link
        to="/events"
        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">View Events</h2>
          <svg
            className="w-6 h-6 text-purple-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </div>
        <p className="text-gray-600">Browse all events in the system.</p>
      </Link>
    </div>
  );

  const StandardUserDashboard = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <p className="text-gray-600 mb-4">
        Welcome to our event management platform! Browse through exciting events and book your tickets.
      </p>
      <Link
        to="/events"
        className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Browse Events
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome, {user?.name || 'Guest'}!
      </h1>

      {isOrganizer && <OrganizerDashboard />}
      {isAdmin && <AdminDashboard />}
      {!isOrganizer && !isAdmin && <StandardUserDashboard />}
    </div>
  );
}