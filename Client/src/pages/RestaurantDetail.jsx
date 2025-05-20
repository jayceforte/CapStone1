import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SubmitReview from "../pages/SubmitReview";
import "./RestaurantDetail.css";

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(null);
  const [error, setError] = useState(null);

const handleDelete = async (reviewId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete your old review?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:4001/reviews/${reviewId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to delete your  review");
    }

    // Refresh the reviews
    setReviews(reviews.filter((r) => r.id !== reviewId));
  } catch (err) {
    console.error("Delete error:", err.message);
    alert("❌ " + err.message);
  }
};

  useEffect(() => {
    fetch(`http://localhost:4001/restaurants/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setRestaurant(data.restaurant);
        setReviews(data.reviews);
        setAverage(data.average_rating);
      })
      .catch((err) => {
        console.error("Failed to find restaurant:", err);
        setError("❌ Could not find restaurant");
      });
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!restaurant) return <p>Loading...</p>;

  return (
    <div className="restaurant-detail">
      <div className="restaurant-info">
        <h2>{restaurant.name}</h2>
        <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
        <p><strong>Location:</strong> {restaurant.location}</p>
        <p><strong>Average Rating:</strong> {average ? `${average} / 5` : "No ratings yet"}</p>
      </div>

      <div className="review-section">
        <h3>Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul className="review-list">
            {reviews.map((r) => (
              <li key={r.id} className="review-item">
                <strong>{r.username}</strong> rated it {r.rating}/5
                <p>{r.content}</p>
                <small>{new Date(r.created_at).toLocaleString()}</small>
              
   <button onClick={() => handleDelete(r.id)} className="delete-button">
   Delete
</button>

    
              </li>
            ))}
          </ul>
        )}

        <SubmitReview
          restaurantId={id}
          onReviewSubmitted={() => {
            fetch(`http://localhost:4001/restaurants/${id}`, {
              credentials: "include",
            })
              .then((res) => res.json())
              .then((data) => {
                setRestaurant(data.restaurant);
                setReviews(data.reviews);
                setAverage(data.average_rating);
              });
          }}
        />
      </div>
    </div>
  );
}


