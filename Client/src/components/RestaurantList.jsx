import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Restaurants.css";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/restaurants", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => console.error("Failed to fetch restaurants:", err));
  }, []);

  return (
    <div className="restaurants-page">
      <h1>Browse All Restaurants</h1>
      <div className="restaurant-grid">
        {restaurants.map((r) => (
          <Link to={`/restaurants/${r.id}`} key={r.id} className="restaurant-card">
           <img
  src={r.image_url}
  alt={`${r.name} preview`}
  className="restaurant-img"
/>





            <h2>{r.name}</h2>
            <p><strong>Cuisine:</strong> {r.cuisine}</p>
            <p><strong>Location:</strong> {r.location}</p>
            <p><strong>Rating:</strong> {r.average_rating ? `${r.average_rating} / 5` : "Not yet rated"}</p>
          </Link>
        ))}
      </div>
    </div>
    
  );
}


