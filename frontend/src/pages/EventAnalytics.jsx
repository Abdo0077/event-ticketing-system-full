import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const EventAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { eventId } = useParams();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/users/events/analytics`, {
                    withCredentials: true
                });
                setAnalytics(response.data.analytics);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch analytics');
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [eventId]);

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

    const chartData = {
        labels: ['Booked Tickets', 'Available Tickets'],
        datasets: [
            {
                data: [
                    analytics.totalTicketsSold,
                    analytics.totalEvents * 100 - analytics.totalTicketsSold // Assuming each event has 100 tickets
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(200, 200, 200, 0.8)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(200, 200, 200, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Ticket Booking Analytics',
                font: {
                    size: 16
                }
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Event Analytics</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Events</h3>
                        <p className="text-3xl font-bold text-blue-600">{analytics.totalEvents}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Tickets Sold</h3>
                        <p className="text-3xl font-bold text-green-600">{analytics.totalTicketsSold}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
                        <p className="text-3xl font-bold text-purple-600">${analytics.totalRevenue}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="max-w-md mx-auto">
                        <Pie data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventAnalytics; 