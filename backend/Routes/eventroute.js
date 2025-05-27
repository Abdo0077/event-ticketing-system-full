const express = require('express');
const router = express.Router();
const eventController = require('../Controller/eventcontroller');
const authorizationMiddleware = require('../Middleware/authorizationMiddleware');

// Admin specific routes must come before generic /:id routes
router.get('/all', authorizationMiddleware('System Admin'), eventController.getAllEventsAdmin);

// Organizer specific routes
router.get('/users/my-events', authorizationMiddleware('Organizer'), eventController.getMyEvents);
router.get('/users/analytics', authorizationMiddleware('Organizer'), eventController.getMyEventAnalytics);

// Generic routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Organizer
router.post('/', authorizationMiddleware('Organizer'), eventController.createEvent);
router.put('/:id', authorizationMiddleware(['Organizer', 'System Admin']), eventController.updateEvent);
router.delete('/:id', authorizationMiddleware(['Organizer', 'System Admin']), eventController.deleteEvent);
router.get('/users/my-events', authorizationMiddleware('Organizer'), eventController.getMyEvents);
router.get('/users/analytics', authorizationMiddleware('Organizer'), eventController.getMyEventAnalytics);

// Admin
router.get('/all', authorizationMiddleware('System Admin'), eventController.getAllEvents);
router.put('/:id/approve', authorizationMiddleware('System Admin'), eventController.updateEventStatus);
router.put('/:id/decline', authorizationMiddleware('System Admin'), eventController.updateEventStatus);

module.exports = router;