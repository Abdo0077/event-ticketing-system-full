import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getNavLinks = () => {
        const commonLinks = [
            { to: '/', label: 'Home' },
            { to: '/profile', label: 'Profile' },
        ];

        const roleSpecificLinks = {
            'Standard User': [
                { to: '/my-bookings', label: 'My Bookings' },
            ],
            'Organizer': [
                { to: '/my-events', label: 'My Events' },
            ],
            'System Admin': [
                { to: '/admin/users', label: 'Manage Users' },
                { to: '/admin/events', label: 'Manage Events' },
            ],
        };

        return [...commonLinks, ...(roleSpecificLinks[user?.role] || [])];
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-blue-600">EventHub</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {getNavLinks().map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={handleLogout}
                            className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 