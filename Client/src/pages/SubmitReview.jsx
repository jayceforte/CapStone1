import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";

export default function SubmitReview({ user }) {
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("itemId");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch("/reviews", {
        method: "POST",
        body: JSON.stringify({ itemId, rating, comment }),
      });
      navigate(`/item/${itemId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Write your Review</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Rating:
          <select value={rating} onChange={e => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map(num => (
              <option key={num} value={num}>★{num}</option>
            ))}
          </select>
        </label>

        <br />

        <label>
          Comment:
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            required
          />
        </label>

        <br />

        <button type="submit">Submit Your Review</button>
        {error && <p style={{ color: "Green" }}>{error}</p>}
      </form>
    </div>
  );
}
