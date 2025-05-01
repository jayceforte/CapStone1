import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {apiFetch} from "../api"

export default function ItemDetail() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      apiFetch(`/items/${id}`)
        .then(data => {
          setItem(data.item);
          setReviews(data.reviews);
        })
        .catch(err => setError(err.message));
    }, [id]);
  
    if (error) return <p>Error: {error}</p>;
    if (!item) return <p>Waiting...</p>;
  
    return (
      <div>
        <h1>{item.name}</h1>
        <p>{item.description}</p>
  
        <h2>Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews available.</p>
        ) : (
          <ul>
            {reviews.map(review => (
              <li key={review._id}>
                <strong>{review.user.username}</strong>: {review.comment} – ★{review.rating}
              </li>
            ))}
          </ul>
        )}
  
        <a href="/submit">Write your own review</a>
      </div>
    );
  }