import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Restaurants.css";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/restaurants", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => console.error("Failed to fetch restaurants:", err));
  }, []);

  const filteredRestaurants = restaurants.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      r.name.toLowerCase().includes(term) ||
      r.cuisine.toLowerCase().includes(term) ||
      r.location.toLowerCase().includes(term)
    );
  });

  return (
    <div className="restaurants-page">
      <h1>Browse Restaurants</h1>

      <input
        type="text"
        className="search-bar"
        placeholder="Search by name, cuisine, or location"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="restaurant-grid">
        {filteredRestaurants.length === 0 ? (
          <p>No matching restaurants found.</p>
        ) : (
          filteredRestaurants.map((r) => (
            <Link to={`/restaurants/${r.id}`} key={r.id} className="restaurant-card">
              {r.image_url && (
                <img src={r.image_url} alt={r.name} className="restaurant-img" />
              )}
              <h2>{r.name}</h2>
              <p><strong>Cuisine:</strong> {r.cuisine}</p>
              <p><strong>Location:</strong> {r.location}</p>
              <p><strong>Rating:</strong> {r.average_rating ? `${r.average_rating} / 5` : "Not yet rated"}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}



