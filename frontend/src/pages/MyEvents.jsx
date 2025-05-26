import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/users/events", {
                withCredentials: true
            });
            // The events are nested in response.data.events
            setEvents(response.data.events || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching events:", err);
            setError("Failed to fetch events");
            setLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await axios.delete(`http://localhost:3000/api/v1/events/${eventId}`, {
                    withCredentials: true
                });
                fetchEvents(); // Refresh the list
            } catch (err) {
                setError("Failed to delete event");
            }
        }
    };

    const handleEdit = (eventId) => {
        navigate(`/edit-event/${eventId}`);
    };

    const handleViewAnalytics = (eventId) => {
        navigate(`/event-analytics/${eventId}`);
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Events</h1>
                <button
                    onClick={() => navigate("/create-event")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Create Event
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event._id} className="border rounded-lg p-4 shadow-sm">
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                        <p className="text-gray-600 mb-4">{event.description}</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleEdit(event._id)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(event._id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => handleViewAnalytics(event._id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                            >
                                View Analytics
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {events.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    No events found. Create your first event!
                </div>
            )}
        </div>
    );
};

export default MyEvents; 