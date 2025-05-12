import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api"; 
export default function ReviewDetail() {
  const { id } = useParams(); 
  const [review, setReview] = useState(null);
  const [error, setError] = useState(null);

useEffect(() => {
  async function loadReview() {
    console.log("Fetching review for ID:", id); 
    try {
      const data = await apiFetch(`/reviews/${id}`);
      console.log("Fetched review:", data); 
      setReview(data);
    } catch (err) {
      console.error("Review fetch error:", err);
      setError(err.message);
    }
  }
  loadReview();
}, [id]);


  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!review) return <p>Loading review...</p>;

  return (
    <div>
      <h2>Review Detail</h2>
      <p><strong>Rating:</strong> {review.rating}/5</p>
      <p>{review.content}</p>
      <p><small>Review ID: {review.id}</small></p>
    </div>
  );
}
