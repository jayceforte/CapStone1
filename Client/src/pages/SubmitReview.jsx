import { useState } from "react";

export default function SubmitReview({ restaurantId, onReviewSubmitted }) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

console.log("Submitting review with:", {
  content,
  rating,
  restaurant_id: Number(restaurantId), 
 
});


    if (!restaurantId) {
      setMessage("❌ Restaurant ID is missing");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          content,
          rating,
          restaurant_id: Number(restaurantId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setMessage("✅ Review submitted!");
      setContent("");
      setRating(5);
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      console.error("Submit review error:", err);
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Submit a Review</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your review here..."
          required
        />
        <br />
        <label>
          Rating:
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
}


