const express = require('express');
const { User, Item } = require('./models');
const router = express.Router();

// Middleware to authenticate users
const authenticate = async (req, res, next) => {
  // Add JWT-based authentication logic here
  next();
};

// Donor: Add an item for auction
router.post('/donate', authenticate, async (req, res) => {
  try {
    const { title, description, image, auctionEndsAt } = req.body;
    const item = new Item({
      title,
      description,
      image,
      donor: req.user.id,
      auctionEndsAt,
    });
    await item.save();
    res.status(201).json({ message: 'Item added for donation', item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NGO: Bid on an item
router.post('/bid/:itemId', authenticate, async (req, res) => {
  const session = await mongoose.startSession();
  const { itemId } = req.params;
  const { bidAmount } = req.body;
  try {
    session.startTransaction();
    const item = await Item.findById(itemId).session(session);
    if (!item) throw new Error('Item not found');
    if (item.status !== 'Active') throw new Error('Auction not active');

    if (req.user.points < bidAmount) throw new Error('Not enough points');
    if (bidAmount <= item.currentBid.amount) throw new Error('Bid too low');

    // Refund points to previous bidder
    if (item.currentBid.bidder) {
      await User.findByIdAndUpdate(item.currentBid.bidder, { $inc: { points: item.currentBid.amount } }, { session });
    }

    // Deduct points from current bidder
    await User.findByIdAndUpdate(req.user.id, { $inc: { points: -bidAmount } }, { session });

    // Update the item bid
    item.currentBid = { amount: bidAmount, bidder: req.user.id };
    await item.save({ session });

    await session.commitTransaction();
    res.json({ message: 'Bid placed successfully', item });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
});

// Auction End (Triggered by scheduler)
router.post('/auction-end/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);
    if (!item) throw new Error('Item not found');
    if (item.status !== 'Active') throw new Error('Auction not active');

    item.status = 'Completed';
    await item.save();

    res.json({ message: 'Auction ended', item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
