// pages/api/dailyVerse.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Fetching a specific verse for demonstration; adjust as needed
      const verse = await prisma.daily_verse_view.findFirst({});

      if (verse) {
        res.status(200).json(verse);
      } else {
        res.status(404).json({ message: "Verse not found." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch the verse." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
