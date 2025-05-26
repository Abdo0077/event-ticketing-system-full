const Event = require('../Model/EventSchema');
// Create a new event (Organizer only)
exports.createEvent = async (req, res) => {
    try {
        const event = new Event({
            ...req.body,
            organizer: req.user.userId,
            remainingTickets: req.body.totalTickets
        });
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all approved events (Public)
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'approved' });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single event by ID (Public)
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an event (Organizer or Admin)
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });


        const updatableFields = ['title', 'description', 'date', 'location', 'category', 'ticketPrice', 'totalTickets', 'image'];
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) event[field] = req.body[field];
        });

        if (req.body.totalTickets !== undefined) {
            event.remainingTickets = req.body.totalTickets; // You can handle logic here for adjusting existing bookings
        }

        await event.save();
        res.json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete an event (Organizer or Admin)
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });


        await event.deleteOne();
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Approve/Decline event (Admin only)
exports.updateEventStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        event.status = req.body.status;
        await event.save();

        res.json({ message: `Event ${event.status}`, event });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Organizer: Get their own events
exports.getMyEvents = async (req, res) => {
    try {
        console.log("here");
        const events = await Event.find({ organizer: req.user.userId });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Organizer: Analytics
exports.getMyEventAnalytics = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user._id });

        const analytics = events.map(event => ({
            title: event.title,
            percentageBooked: ((event.totalTickets - event.remainingTickets) / event.totalTickets * 100).toFixed(2)
        }));

        res.json(analytics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};