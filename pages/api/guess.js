import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { book, chapter, verse } = req.body;

    console.log(req.body);

    try {
      // First, find the book's order based on the title_short
      const verseInfo = await prisma.daily_verse_view.findFirst({
        where: {
          // Specify your conditions here, for example:
          title_short: book,
          chapter: parseInt(chapter, 10), // The '10' is the radix parameter, specifying the base of the numerical system used. For decimal numbers, it's 10.
          verse: parseInt(verse, 10),
        },
      });

      if (verseInfo) {
        res.status(200).json(verseInfo);
      } else {
        res.status(404).json({ message: "Verse not found." });
      }
    } catch (error) {
      console.error("Failed to fetch the verse:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
