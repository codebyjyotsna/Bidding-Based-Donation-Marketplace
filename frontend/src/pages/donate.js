import React, { useState } from 'react';

const Donate = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    donorId: '',
    auctionEndsAt: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3000/donate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <input
        type="text"
        placeholder="Image URL"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
      />
      <input
        type="datetime-local"
        value={formData.auctionEndsAt}
        onChange={(e) => setFormData({ ...formData, auctionEndsAt: e.target.value })}
      />
      <button type="submit">Donate</button>
    </form>
  );
};

export default Donate;
