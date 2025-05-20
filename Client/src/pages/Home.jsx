import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4001/restaurants", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="home">
      <h1>Explore Restaurants</h1>
      <div className="restaurant-list">
        {restaurants.length === 0 ? (
          <p>No restaurants found.</p>
        ) : (
          restaurants.map((r) => (
            <Link to={`/restaurants/${r.id}`} key={r.id} className="restaurant-card">
              <h2>{r.name}</h2>
              <p><strong>Cuisine:</strong> {r.cuisine}</p>
              <p><strong>Location:</strong> {r.location}</p>
              <p><strong>Rating:</strong> {r.average_rating ? `${r.average_rating} / 5` : "No ratings yet"}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

  