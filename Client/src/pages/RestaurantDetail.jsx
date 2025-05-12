import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SubmitReview from "../pages/SubmitReview";

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [average, setAverage] = useState(null);


  console.log("route param id:", id);

  useEffect(() => {
    fetch(`http://localhost:4000/restaurants/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
         console.log("Restaurant API data:", data);
        setRestaurant(data.restaurant);
        setReviews(data.reviews);
        setAverage(data.average_rating);
      })
      .catch((err) => {
        console.error("Failed to find restaurant:", err);
        setError("❌ Could not find restaurant");
      });
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!restaurant) return <p>Loading...</p>;

  return (
    <div>
      <h2>{restaurant.name}</h2>
      {average !== null ? (
  <p><strong>Average Rating:</strong> {average} / 5</p>
) : (
  <p><strong>No ratings yet</strong></p>
)}

      <p>
        <strong>Cuisine:</strong> {restaurant.cuisine}
      </p>
      <p>
        <strong>Location:</strong> {restaurant.location}
      </p>

      <h3>Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews available yet.</p>
      ) : (
        <ul>
          {reviews.map((r) => (
            <li key={r.id}>
              <strong>{r.username}</strong> rated {r.rating}/5
              <br />
              {r.content}
              <br />
              <small>{new Date(r.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}

      
      <SubmitReview
        restaurantId={id}
        onReviewSubmitted={() => {
          fetch(`http://localhost:4000/restaurants/${id}`, {
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
  );
}
