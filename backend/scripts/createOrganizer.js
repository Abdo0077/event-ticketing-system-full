const mongoose = require('mongoose');
const User = require('../Model/UserSchema');
const bcrypt = require('bcrypt');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/eventmanagement', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const createOrganizer = async () => {
  try {
    // Check if organizer exists
    let organizer = await User.findOne({ role: 'Organizer' });
    
    if (!organizer) {
      // Create new organizer
      const hashedPassword = await bcrypt.hash('organizer123', 10);
      organizer = await User.create({
        name: 'Test Organizer',
        email: 'organizer@test.com',
        password: hashedPassword,
        role: 'Organizer'
      });
      console.log('New organizer created:', organizer);
    } else {
      console.log('Existing organizer found:', organizer);
    }

    // Update the organizer ID in seedEvents.js
    const fs = require('fs');
    const path = require('path');
    const seedEventsPath = path.join(__dirname, 'seedEvents.js');
    let seedEventsContent = fs.readFileSync(seedEventsPath, 'utf8');
    
    // Replace the placeholder organizer ID with the actual one
    seedEventsContent = seedEventsContent.replace(
      /'65f1a1234567890123456789'/g,
      `'${organizer._id}'`
    );
    
    fs.writeFileSync(seedEventsPath, seedEventsContent);
    console.log('Updated seedEvents.js with organizer ID');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
};

createOrganizer(); 