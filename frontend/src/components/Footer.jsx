import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">EventHub</h3>
                        <p className="text-gray-300">
                            Your one-stop platform for event management and ticketing.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-300 hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" className="text-gray-300 hover:text-white">
                                    Profile
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>Email: support@eventhub.com</li>
                            <li>Phone: (555) 123-4567</li>
                            <li>Address: 123 Event Street, City, Country</li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
                    <p>&copy; {new Date().getFullYear()} EventHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 