
export default function ReviewList({reviews, error}) {
    if (error) return <p>{error}</p>;
 



  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews .</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <strong>{review.username}</strong> rated  {review.rating}/5
              <br />
              {review.content}
              <br />
              <small>{new Date(review.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
