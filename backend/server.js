const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const pg = require("pg");



dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(` Server listening on port ${PORT}`);
});


const client = new pg.Client({ connectionString: process.env.DATABASE_URL });



async function init() {
  await client.connect();
  console.log("Connected to DB");
}

init();

const allowedOrigins = [
  "http://localhost:5173",
  "https://capstone1-2-front-end.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true,
    sameSite: "lax"
  }
}));
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/me", (req, res) => {
  if (req.session.userId) {
    res.json({ userId: req.session.userId });
  } else {
    res.status(401).json({ error: "Not logged in" });
  }
});


app.post("/reviews", async (req, res) => {
  const user_id = req.session.userId;
  const { content, rating, restaurant_id } = req.body;

  if (!user_id || !content || !rating || !restaurant_id) {
    return res.status(400).json({ error: "Missing fields in request body" });
  }

  try {
    console.log("Received review:", { content, rating, restaurant_id });

    const result = await client.query(
      `INSERT INTO reviews (user_id, restaurant_id, content, rating, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
      [user_id, restaurant_id, content, rating]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Failed to insert review into DB:", err);
    res.status(500).json({ error: "Failed to fetch user review" });
  }
});

app.get("/reviews", async (req, res) => {
  try {
    const result = await client.query(
      `SELECT r.*, u.username 
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error getting reviews:", err);
    res.status(500).json({ error: "Failed to find reviews" });
  }
});

app.get("/reviews/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query("SELECT * FROM reviews WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching review:", err);
    res.status(500).json({ error: "Server error retrieving review" });
  }
});

app.delete("/reviews/:id", async (req, res) => {
  const user_id = req.session.userId;
  const reviewId = req.params.id;

  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // make sure the review belongs to the certain user
    const result = await client.query(
      "DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING *",
      [reviewId, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ error: "You can only delete your own review." });
    }

    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error("Failed to delete review:", err);
    res.status(500).json({ error: "Server error deleting review" });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }
try {
  const result = await client.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = result.rows[0];

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  req.session.userId = user.id;
  res.json({ message: "Login successful" });
} catch(err){
  console.error("login Error", err);
  res.status(500).json({error: "Server error when attempting login"});
}
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    console.log("Signup payload:", { username, email, password });

    const result = await client.query(
      `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`,
      [username, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: "Username or email already exists" });
    } 
    console.error("Signup error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get("/restaurants", async (req, res) => {
  try {
    const result = await client.query(`
      SELECT 
        r.id,
        r.name,
        r.cuisine,
        r.location,
        r.image_url,
        AVG(rv.rating)::numeric(3,1) AS average_rating
      FROM restaurants r
      LEFT JOIN reviews rv ON r.id = rv.restaurant_id
      GROUP BY r.id, r.name, r.cuisine, r.location, r.image_url
      ORDER BY r.name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch restaurants:", err);
    res.status(500).json({ error: "Unable to load restaurants" });
  }
});



app.get("/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const restaurantResult = await client.query(
      "SELECT * FROM restaurants WHERE id = $1",
      [id]
    );

    const reviewsResult = await client.query(
      `SELECT reviews.*, users.username
       FROM reviews
       JOIN users ON reviews.user_id = users.id
       WHERE restaurant_id = $1
       ORDER BY created_at DESC`,
      [id]
    );

    const averageResult = await client.query(
      `SELECT AVG(rating)::numeric(3,1) AS average_rating
       FROM reviews
       WHERE restaurant_id = $1`,
      [id]
    );

    res.json({
      restaurant: restaurantResult.rows[0],
      reviews: reviewsResult.rows,
      average_rating: averageResult.rows[0].average_rating || null,
    });
  } catch (err) {
    console.error("Error loading restaurant:", err);
    res.status(500).json({ error: "Failed to load restaurant" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.path });
});



module.exports = app;