const express = require("express");
const getClient = require("../db");
const requireAuth = require("../middleware/requireAuth")

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
const {itemId, rating, comment} = req.body;
const userId = req.session.userId;

if(!itemId || !rating || !comment) {
    return res.status(400).json({ message: "Missing fields"});
}

const client = getClient();
try {
    await client.connect();
    const result = await client.query (
        `INSERT INTO reviews (item_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING id, item_id, user_id, rating, comment`,
      [itemId, userId, rating, comment]
    );
    
    res.status(201).json(result.rows[0]);
} catch(err){
    console.error("Something went wrong submitting review", err);
    res.status(500).json({ message: "Server Error"})
} finally {
    client.end();
}
});
module.exports = router;