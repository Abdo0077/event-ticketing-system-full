const mongoose = require("mongoose");

// Event Schema
const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    ticketPrice: { type: Number, required: true },
    totalTickets: { type: Number, required: true },
    remainingTickets: { type: Number, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending', required: true }
}, { timestamps: true });

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;