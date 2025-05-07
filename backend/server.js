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

app.get("/reviews", (req, res) => {
  res.json([{ id: 1, content: "This is a review", rating: 5 }]);
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
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const result = await client.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
