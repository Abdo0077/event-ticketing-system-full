const Event = require('../Model/EventSchema');
// Create a new event (Organizer only)
exports.createEvent = async (req, res) => {
    try {
        const event = new Event({
            ...req.body,
            organizer: req.user.userId,
            remainingTickets: req.body.totalTickets,
            status: 'pending' // All new events start as pending
        });
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all events (Admin only)
exports.getAllEventsAdmin = async (req, res) => {
    try {
        const events = await Event.find().populate('organizer', 'name');
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all approved events (Public)
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'approved' }).populate('organizer', 'name');
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single event by ID (Public for approved events, Admin for all)
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer', 'name');
        if (!event) return res.status(404).json({ message: 'Event not found' });
        
        // Only allow viewing if event is approved or user is admin
        if (event.status !== 'approved' && (!req.user || req.user.role !== 'System Admin')) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
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

        // Check if user is authorized to update
        if (req.user.role !== 'System Admin' && event.organizer.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatableFields = ['title', 'description', 'date', 'location', 'category', 'ticketPrice', 'totalTickets', 'image'];
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) event[field] = req.body[field];
        });

        if (req.body.totalTickets !== undefined) {
            event.remainingTickets = req.body.totalTickets;
        }

        // If organizer updates, set status back to pending
        if (req.user.role !== 'System Admin') {
            event.status = 'pending';
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

        // Check if user is authorized to delete
        if (req.user.role !== 'System Admin' && event.organizer.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await event.deleteOne();
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update event status (Admin only)
exports.updateEventStatus = async (req, res) => {
    try {
        if (req.user.role !== 'System Admin') {
            return res.status(403).json({ message: 'Only admins can update event status' });
        }

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Determine status based on the endpoint
        const status = req.path.endsWith('/approve') ? 'approved' : 'declined';

        event.status = status;
        await event.save();

        res.json({ message: `Event ${status}`, event });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Organizer: Get their own events
exports.getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user.userId });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Organizer: Analytics
exports.getMyEventAnalytics = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user.userId });

        const analytics = events.map(event => ({
            title: event.title,
            percentageBooked: ((event.totalTickets - event.remainingTickets) / event.totalTickets * 100).toFixed(2)
        }));

        res.json(analytics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};