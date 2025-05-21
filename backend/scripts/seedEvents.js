const mongoose = require('mongoose');
const Event = require('../Model/EventSchema');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/eventmanagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample event data
const events = [
  {
    title: 'Summer Music Festival 2024',
    description: 'A three-day music festival featuring top artists from around the world.',
    date: new Date('2024-07-15'),
    location: 'Central Park, New York',
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070',
    ticketPrice: 299.99,
    totalTickets: 5000,
    remainingTickets: 4850,
    organizer: '682dd1714bb705fcf54e830c', // You'll need to replace this with a valid organizer ID
    status: 'approved'
  },
  {
    title: 'Tech Conference 2024',
    description: 'Annual technology conference showcasing the latest innovations in AI and web development.',
    date: new Date('2024-06-20'),
    location: 'Convention Center, San Francisco',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070',
    ticketPrice: 499.99,
    totalTickets: 1000,
    remainingTickets: 50,
    organizer: '682dd1714bb705fcf54e830c', // You'll need to replace this with a valid organizer ID
    status: 'approved'
  },
  {
    title: 'Food & Wine Festival',
    description: 'Experience the finest cuisines and wines from renowned chefs and wineries.',
    date: new Date('2024-05-10'),
    location: 'Waterfront Park, Miami',
    category: 'Food & Beverage',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070',
    ticketPrice: 150.00,
    totalTickets: 2000,
    remainingTickets: 0,
    organizer: '682dd1714bb705fcf54e830c', // You'll need to replace this with a valid organizer ID
    status: 'approved'
  },
  {
    title: 'Sports Championship Finals',
    description: 'The ultimate showdown of the season with the top teams competing for the championship.',
    date: new Date('2024-08-30'),
    location: 'Sports Arena, Los Angeles',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070',
    ticketPrice: 199.99,
    totalTickets: 15000,
    remainingTickets: 8000,
    organizer: '682dd1714bb705fcf54e830c', // You'll need to replace this with a valid organizer ID
    status: 'approved'
  }
];

// Function to seed the database
const seedEvents = async () => {
  try {
    // Clear existing events
    await Event.deleteMany({});
    
    // Insert new events
    const createdEvents = await Event.insertMany(events);
    console.log('Database seeded successfully with test events:', createdEvents);
    
    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

// Run the seeding function
seedEvents(); 