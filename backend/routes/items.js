const express = require("express");
const getClient = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  const client = getClient();
  try {
    await client.connect();

    const result = await client.query("SELECT * FROM items ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Get items error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.end();
  }
});

router.get("/:id", async (req, res) => {
  const client = getClient();
  const itemId = req.params.id;

  try {
    await client.connect();

    const itemResult = await client.query(
      "SELECT * FROM items WHERE id = $1",
      [itemId]
    );
    if (itemResult.rows.length === 0) {
      return res.status(404).json({ message: "Item not available" });
    }

    const reviewsResult = await client.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.username
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.item_id = $1
       ORDER BY r.created_at DESC`,
      [itemId]
    );

    res.json({
      ...itemResult.rows[0],
      reviews: reviewsResult.rows
    });
  } catch (err) {
    console.error("Get item by ID error:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.end();
  }
});

module.exports = router;
