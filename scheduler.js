const cron = require('node-cron');
const { Item } = require('./models');

const setupScheduler = () => {
  // Check every minute for auctions to close
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const items = await Item.find({ auctionEndsAt: { $lte: now }, status: 'Active' });

    for (const item of items) {
      item.status = 'Completed';
      await item.save();
      console.log(`Auction ended for item: ${item._id}`);
    }
  });
};

module.exports = setupScheduler;
