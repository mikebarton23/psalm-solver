const pool = require("../../lib/db");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { page } = req.body; // We're only using 'page' now, removed 'visitorIp'

    try {
      const queryText = "INSERT INTO site_visits(page) VALUES($1)";
      const values = [page]; // Removed the visitorIp from values
      await pool.query(queryText, values);

      res.status(200).json({ message: "Visit recorded successfully" });
    } catch (error) {
      console.error("Error recording visit: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Handle any requests that aren't POST
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
