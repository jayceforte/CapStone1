import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/restaurants", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRestaurants(data);
        } else {
          throw new Error("Expected array, got something else");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("❌ Could not load restaurants");
      });
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Restaurants</h2>
      <ul>
        {restaurants.map((r) => (
          <li key={r.id}>
            <Link to={`/restaurants/${r.id}`}>
              <strong>{r.name}</strong> – {r.cuisine}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

