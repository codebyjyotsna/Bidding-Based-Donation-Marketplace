const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ['Donor', 'NGO'], required: true },
  points: { type: Number, default: 0 }, // Only applicable for NGOs
});

// Item Schema
const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // URL of the uploaded image
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  auctionEndsAt: { type: Date, required: true },
  currentBid: {
    amount: { type: Number, default: 0 },
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  status: { type: String, enum: ['Pending', 'Active', 'Completed'], default: 'Pending' },
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Item: mongoose.model('Item', itemSchema),
};
