import express from  "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import session from "express-session";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/reviews", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM reviews ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user reviews:", err);
    res.status(500).json({ error: "Failed to fetch user reviews" });
  }
});
app.post("/reviews", async (req, res) => {
  const { user_id, content, rating } = req.body;

  if (!user_id || !content || !rating) {
    return res.status(400).json({ error: "Missing fields in request body" });
  }

  try {
    const result = await client.query(
      `INSERT INTO reviews (user_id, content, rating, created_at)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [user_id, content, rating]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching user review:", err);
    res.status(500).json({ error: "Failed to fetch user review" });
  }
});


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));


app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
