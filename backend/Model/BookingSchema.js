
const mongoose = require("mongoose");


const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    numberOfTickets: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "canceled"], default: "confirmed" },
}, { timestamps: true });

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;