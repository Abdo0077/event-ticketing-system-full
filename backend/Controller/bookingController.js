const Booking = require('../Model/BookingSchema');
const Event = require('../Model/EventSchema');
const mongoose = require('mongoose');

exports.bookAnEvent = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { event: eventId, numberOfTickets } = req.body;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: "Invalid event ID." });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        if (!numberOfTickets || numberOfTickets <= 0) {
            return res.status(400).json({ message: "Invalid number of tickets." });
        }

        const totalPrice = numberOfTickets * event.ticketPrice;

        const booking = new Booking({
            user: userId,
            event: eventId,
            numberOfTickets,
            totalPrice,
        });

        await booking.save();

        return res.status(201).json({ message: "Booking successful!", booking });
    } catch (err) {
        console.error("Booking error:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// GET /api/v1/bookings/:id
exports.getBookingById = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const userId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: "Invalid booking ID." });
        }

        const booking = await Booking.findOne({ _id: bookingId, user: userId }).populate("event");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        return res.status(200).json({ booking });
    } catch (err) {
        console.error("Error fetching booking:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// DELETE /api/v1/bookings/:id
exports.cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const userId = req.user.userId;

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: "Invalid booking ID." });
        }

        const booking = await Booking.findOneAndDelete({ _id: bookingId, user: userId });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found or not authorized to delete." });
        }

        return res.status(200).json({ message: "Booking cancelled successfully." });
    } catch (err) {
        console.error("Error cancelling booking:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};