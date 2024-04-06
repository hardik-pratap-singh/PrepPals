const mongoose = require('mongoose');

// Define the main meeting schema
const meetingSchema = new mongoose.Schema({
  meetingID: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: false,
    default : Date.now()
  },
  points: [{
    type: Number,
    required: true
  }], // Array of points (simple numbers)
  reviews: [{
    type: String,
    required: true
  }] // Array of reviews (sentences)
});

// Create a model using the meeting schema
const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
