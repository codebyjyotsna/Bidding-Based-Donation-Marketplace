const { Item } = require('./models');

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join auction room
    socket.on('joinAuction', (itemId) => {
      socket.join(`auction-${itemId}`);
      console.log(`User joined auction room: auction-${itemId}`);
    });

    // Broadcast new bid
    socket.on('newBid', async ({ itemId, bidAmount, bidder }) => {
      const item = await Item.findById(itemId);
      if (!item || item.status !== 'Active') {
        socket.emit('error', 'Invalid auction or bid');
        return;
      }

      io.to(`auction-${itemId}`).emit('bidUpdate', { itemId, bidAmount, bidder });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = setupSocket;
