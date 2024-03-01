// pages/api/dailyVerse.js
const pool = require("../../lib/db");

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Perform a query using the pool
      const { rows } = await pool.query("select * from daily_verse_view");
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch the verse." });
    }
  } else {
    // Handle any non-GET requests
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
