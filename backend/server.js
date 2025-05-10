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
  const {  content, rating } = req.body;
  
  console.log("SESSION:", req.session);
  console.log("BODY:", req.body);

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





app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
