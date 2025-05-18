import { useState, useEffect } from "react";
import SubmitReview from "./SubmitReview";
import ReviewList from "./ReviewList";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  const loadReviews = async () => {
    try {
      const res = await fetch("https://capstone1-gxtz.onrender.com/reviews", {
        credentials: "include"
      });
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error(data.error || "Invalid response");
      setReviews(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("❌ Could not load reviews");
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div>
      <h1>Reviews</h1>
      <SubmitReview onSubmitSuccess={loadReviews} />
      <ReviewList reviews={reviews} error={error} />
    </div>
  );
}
