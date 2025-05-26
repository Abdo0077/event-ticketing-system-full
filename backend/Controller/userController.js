const userModel = require("../Model/UserSchema");
const jwt = require("jsonwebtoken");
const secretKey = "123456";
const bcrypt = require("bcrypt");
const Event = require("../Model/EventSchema");

const userController = {
    register: async (req, res) => {
        try {
            const {name, email, profilePicture, password, role} = req.body;
            const existingUser = await userModel.findOne({ email });
            
            if (existingUser) {
                return res.status(409).json({ message: "User already exists" });
            }
        
            const hashedPassword = await bcrypt.hash(password, 10);


            const newUser = new userModel({
                name,
                email,
                profilePicture,
                password: hashedPassword,
                role,
              });

              await newUser.save();

              res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ message: "Server error" });
          }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
      
            // Find the user by email
            const user = await userModel.findOne({ email });
            if (!user) {
              return res.status(404).json({ message: "email not found" });
            }
      
            console.log("password: ", user.password);
            // Check if the password is correct
      
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
              return res.status(405).json({ message: "incorect password" });
            }
      
            const currentDateTime = new Date();
            const expiresAt = new Date(+currentDateTime + 1800000); // expire in 3 minutes
            // Generate a JWT token
            const token = jwt.sign(
              { user: { userId: user._id, role: user.role } },
              secretKey,
              {
                expiresIn: 3 * 60 * 60,
              }
            );
      
            return res
              .cookie("token", token, {
                expires: expiresAt,
                httpOnly: true,
                secure: true, // if not working on thunder client , remove it
                SameSite: "none",
              })
              .status(200)
              .json({ message: "login successfully", user });
          } catch (error) {
            console.error("Error logging in:", error);
            res.status(500).json({ message: "Server error" });
          }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            });
            return res.status(200).json({ message: "Logged out successfully" });
        } catch (error) {
            console.error("Error logging out:", error);
            res.status(500).json({ message: "Server error" });
        }
    },
    getAllUsers: async (req, res) => {
      try {
        const users = await userModel.find();
        return res.status(200).json(users);
      } catch (e) {
        return res.status(500).json({ message: e.message });
      }
    },

    //Update user password
    forgetPassword : async (req, res) => {
      try {
        const { email, oldPassword, newPassword } = req.body;
    
        // Validate input
        if (!email || !oldPassword || !newPassword) {
          return res.status(400).json({ message: "Email, old password, and new password are required." });
        }
    
        // Find the user by email
        const user = await User.findOne({ email });
    
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
    
        // Compare old password with hashed password in DB
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: "Old password is incorrect." });
        }
    
        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
    
        res.status(200).json({ message: "Password updated successfully." });
      } catch (error) {
        console.error("Error in forgetPassword:", error);
        res.status(500).json({ message: "Something went wrong." });
      }
    },

 //Get current user's profile 
     getUserProfile : async (req, res) => {
  try {
    // Get user ID from req.user 
    const userId = req.user.userId;

    // Fetch the user from the DB (excluding password)
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error." });
  }
},



//Update current user's profile 
updateUserProfile : async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, email, profilePicture } = req.body;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    // Return updated profile (excluding password)
    const updatedUser = await User.findById(userId).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error." });
  }
},



//Get details of a single user 
getSingleUser: async (req, res) => {
  try {
    const userId = req.params.id;  // Extract the user ID from the URL path

    // Validate if the userId is provided
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await User.findById(userId).select("-password");  // Find the user and exclude the password

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error." });
  }
},


//Update user's role 
updateUserRole : async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    // Validate role
    const validRoles = ["Standard User", "Organizer", "System Admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role provided." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Server error." });
  }
},


//Delete a user 
deleteUser : async (req, res) => {
  try {
    // Extract the user ID from the URL
    const userId = req.params.id;

    // Validate if the user ID is provided
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Check if the user exists before attempting to delete
    const user = await User.findById(userId);

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // If the user exists, proceed with deletion
    await User.findByIdAndDelete(userId);

    // Return a success message after deletion
    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error." });
  }
},



//Get current user's bookings 
getCurrentBookings : async (req, res) => {
  try {
    const userId = req.user.id; // The user ID comes from the authenticated user (from JWT token or session)

    // Find the bookings related to the authenticated user
    const bookings = await Booking.find({ user: userId });

    // If no bookings are found, send a message
    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user." });
    }

    // Send the list of bookings
    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error." });
  }
},



//Get current user's events 
getMyEvents : async (req, res) => {
  try {
    const organizerId = req.user.id;

    const events = await Event.find({ organizer: organizerId });

    if (events.length === 0) {
      return res.status(404).json({ message: "No events found." });
    }

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Error fetching organizer's events:", error);
    res.status(500).json({ message: "Server error." });
  }
},



//Get the analytics of the current user's events 
getMyEventAnalytics : async (req, res) => {
  try {
    const organizerId = req.user.id;

    // 1. Get all events created by this organizer
    const events = await Event.find({ organizer: organizerId });

    if (events.length === 0) {
      return res.status(404).json({ message: "No events found for this organizer." });
    }

    // 2. Extract event IDs
    const eventIds = events.map(event => event._id);

    // 3. Get bookings for these events
    const bookings = await Booking.find({ event: { $in: eventIds } });

    // 4. Calculate analytics
    const totalEvents = events.length;
    const totalTicketsSold = bookings.length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    res.status(200).json({
      success: true,
      analytics: {
        totalEvents,
        totalTicketsSold,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Error getting event analytics:", error);
    res.status(500).json({ message: "Server error." });
  }
},

// Approve/Decline event (Admin only)
updateEventStatus: async (req, res) => {
  try {
    if (req.user.role !== 'System Admin') {
      return res.status(403).json({ message: 'Only System Admin can update event status' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const { status } = req.body;
    if (!['approved', 'declined', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (status === 'declined') {
      await event.deleteOne();
      return res.status(200).json({ 
        message: 'Event declined and deleted', 
        deleted: true, 
        eventId: event._id 
      });
    }

    event.status = status;
    await event.save();

    return res.status(200).json({ 
      message: `Event ${status} successfully`, 
      event,
      status: status 
    });
  } catch (error) {
    console.error('Error updating event status:', error);
    res.status(500).json({ message: 'Server error while updating event status' });
  }
}
};

module.exports = userController;