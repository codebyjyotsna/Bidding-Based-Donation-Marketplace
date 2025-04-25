import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/items')
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  return (
    <div>
      <h1>Active Auctions</h1>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <Link to={`/auction/${item._id}`}>{item.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
