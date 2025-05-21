const express = require('express');
const router = express.Router();
const bookingController = require("../Controller/bookingController");
const authorizationMiddleware = require('../Middleware/authorizationMiddleware');


// POST /api/v1/bookings - Book tickets
router.post("/", authorizationMiddleware("Standard User"), bookingController.bookAnEvent);

// GET /api/v1/bookings/:id - Get booking by ID
router.get("/:id", authorizationMiddleware("Standard User"), bookingController.getBookingById);

// DELETE /api/v1/bookings/:id - Cancel booking
router.delete("/:id", authorizationMiddleware("Standard User"), bookingController.cancelBooking);

module.exports = router;