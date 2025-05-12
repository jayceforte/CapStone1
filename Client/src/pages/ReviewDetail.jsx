import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api";
import "./ReviewDetail.css"; // ✅ link to CSS file

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

  if (error) return <p className="error">{error}</p>;
  if (!review) return <p>Loading review...</p>;

  return (
    <div className="review-detail">
      <div className="review-card">
        <h2>Review Details</h2>
        <p className="rating">⭐ {review.rating} / 5</p>
        <p className="content">{review.content}</p>
        <p className="meta">Review ID: {review.id}</p>
      </div>
    </div>
  );
}

