const Event = require('../Model/EventSchema');

/**
 * Public Event Operations
 */

// Get all events (Public/Admin)
exports.getAllEvents = async (req, res) => {
  try {
    let query = {};
    
    // If user is not an admin, only show approved events
    if (req.user.role !== 'System Admin') {
      query.status = 'approved';
    }

    const events = await Event.find(query).populate('organizer', 'name');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single event by ID (Public/Admin)
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // If user is not an admin and event is not approved, don't show it
    if (req.user.role !== 'System Admin' && event.status !== 'approved') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Organizer Event Operations
 */

// Create a new event (Organizer only)
exports.createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      organizer: req.user.userId,
      remainingTickets: req.body.totalTickets,
      status: 'pending' // Explicitly set status to pending
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get organizer's events
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.userId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get organizer's event analytics
exports.getMyEventAnalytics = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.userId });
    const analytics = events.map(event => ({
      title: event.title,
      status: event.status,
      percentageBooked: ((event.totalTickets - event.remainingTickets) / event.totalTickets * 100).toFixed(2)
    }));
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an event (Organizer or Admin)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Only organizer or admin can update
    if (String(event.organizer) !== req.user.userId && req.user.role !== 'System Admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatableFields = ['title', 'description', 'date', 'location', 'category', 'ticketPrice', 'totalTickets', 'image'];
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) event[field] = req.body[field];
    });

    if (req.body.totalTickets !== undefined) {
      event.remainingTickets = req.body.totalTickets;
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

    if (String(event.organizer) !== req.user.userId && req.user.role !== 'System Admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Admin Event Operations
 */

// Update event status (Admin only)
exports.updateEventStatus = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { status } = req.body;
    if (!['approved', 'declined', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (status === 'declined') {
      await event.deleteOne();
      return res.json({ message: 'Event declined and deleted', deleted: true, eventId: event._id });
    } else {
      event.status = status;
      await event.save();
      return res.json({ message: `Event ${status} successfully`, event, status: status });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Approve an event (Admin only)
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event approved", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Disapprove (delete) an event (Admin only)
exports.disapproveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};