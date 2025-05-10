import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/reviews")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>All Reviewed Items</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <strong>{item.username}</strong> rated {item.rating}/5
            <br />
            {item.content}
            <br />
            <Link to={`/item/${item.id}`}>View details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

  