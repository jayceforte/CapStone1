const express = require("express");
const bcrypt = require("bcryptjs");
const getClient = require("../db");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const client = getClient();

  try {
    await client.connect();

    const checkUser = await client.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );

    req.session.userId = result.rows[0].id;
    res.json({ id: result.rows[0].id, username: result.rows[0].username });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.end();
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const client = getClient();

  try {
    await client.connect();

    const result = await client.query(
      "SELECT id, username, password FROM users WHERE username = $1",
      [username]
    );
    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: " Credentials not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: " Credentials not found" });

    req.session.userId = user.id;
    res.json({ id: user.id, username: user.username });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.end();
  }
});


router.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const client = getClient();
  try {
    await client.connect();

    const result = await client.query(
      "SELECT id, username FROM users WHERE id = $1",
      [req.session.userId]
    );
    const user = result.rows[0];
    res.json(user);
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.end();
  }
});

module.exports = router;
