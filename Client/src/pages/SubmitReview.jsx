import React, { useState } from "react";

const SubmitReview = ({ userId }) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({
          user_id: userId,
          content: content,
          rating: rating
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit review");
      }

      const data = await response.json();
      setMessage("✅ Review submitted!");
      setContent("");
      setRating(5);
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
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default SubmitReview;
