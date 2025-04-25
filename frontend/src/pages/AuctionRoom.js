import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const AuctionRoom = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [bidAmount, setBidAmount] = useState(0);

  useEffect(() => {
    socket.emit('joinAuction', id);
    socket.on('bidUpdate', (update) => {
      if (update.itemId === id) setItem((prev) => ({ ...prev, currentBid: { amount: update.bidAmount } }));
    });

    fetch(`http://localhost:3000/items/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data));
  }, [id]);

  const placeBid = () => {
    socket.emit('newBid', { itemId: id, bidAmount, bidderId: 'NGO123' });
  };

  return (
    <div>
      {item && (
        <>
          <h1>{item.title}</h1>
          <p>{item.description}</p>
          <h3>Current Bid: {item.currentBid.amount}</h3>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
          />
          <button onClick={placeBid}>Place Bid</button>
        </>
      )}
    </div>
  );
};

export default AuctionRoom;
