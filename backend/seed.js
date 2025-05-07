import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  try {
    await client.connect();

    console.log("🔄 Resetting database...");

    await client.query(`
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS users;

      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );

      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Tables created.");

    const password1 = await bcrypt.hash("password123", 10);
    const password2 = await bcrypt.hash("securepass456", 10);

    const reschris = await client.query(
      `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`,
      ["alice", password1]
    );
    const ressteph = await client.query(
      `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`,
      ["steph", password2]
    );

    
    const chrisId = reschris.rows[0].id;
    const stephId = ressteph.rows[0].id;

    await client.query(
      `INSERT INTO reviews (user_id, content, rating)
       VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)`,
      [
        chrisId, "Loved the experience. Highly recommend!", 5,
        stephId, "It was alright, but not the best.", 3,
        stephId, "Terrible experience, would not go back.", 1
      ]
    );

    console.log("✅ Users and reviews seeded.");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await client.end();
  }
}

seed();


