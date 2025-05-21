const express = require("express");
const userController = require("../Controller/userController");
const authorizationMiddleware=require('../Middleware/authorizationMiddleware');
const router = express.Router();

// * Get all users
router.get("/", authorizationMiddleware('System Admin'),userController.getAllUsers);

//public:
//Update user password
router.put("/forgetPassword", userController.forgetPassword);//ssssss//Update user password

//Authenticated Users:
//Get current user’s profile 
router.get("/profile", authorizationMiddleware('System Admin','Organizer','Standard User'), userController.getUserProfile);
//Update current user’s profile 
router.put("/profile", authorizationMiddleware('System Admin','Organizer','Standard User'), userController.updateUserProfile);

//Admin:
//Get details of a single user 
router.get("/:id", authorizationMiddleware("System Admin"), userController.getSingleUser);
//Update user’s role 
router.put("/:id", authorizationMiddleware("System Admin"), userController.updateUserRole);
//Delete a user 
router.delete("/:id",authorizationMiddleware("System Admin"), userController.deleteUser);

//Standard User:
//Get current user’s bookings 
router.get("/bookings", authorizationMiddleware("Standard User"), userController.getCurrentBookings);

//Event Organizer:
//Get current user’s events 
router.get("/events", authorizationMiddleware("Organizer"), userController.getMyEvents);
//Get the analytics of the current user’s events 
router.get("/events/analytics", authorizationMiddleware("Organizer"), userController.getMyEventAnalytics);

module.exports = router; // ! Don't forget to export the router
