"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import confetti from "canvas-confetti";
import { Button } from "./ui/button";
import HintComponent from "./hints";
import BibleBookSelect from "./ui/bibleBookSelect";
import { oldTestamentBooks, newTestamentBooks } from "../data/BibleBooks";
import { toast } from "sonner";

function formatDate(dateString: string) {
  if (!dateString) {
    return "";
  }
  // Split the dateString into parts
  const [year, month, day] = dateString.split("-").map((part) => parseInt(part, 10));
  // Create a new Date object using local time
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function Modal({
  showModal,
  onClose,
  dailyVerseDetails,
  guesses,
  currentGuessIndex,
  gameWon,
  hintsUsed,
}: {
  showModal: boolean;
  onClose: () => void;
  dailyVerseDetails: any; // Replace 'any' with the actual type
  guesses: any[]; // Replace 'any' with the actual type
  currentGuessIndex: number;
  gameWon: boolean;
  hintsUsed: number;
}) {
  if (!showModal) {
    return null;
  }

  const emojiGrid = guesses
    .filter((guess) => guess !== null)
    .map((guess, index) => {
      const bookCorrect = guess.bookCorrect ? "🟩" : "⬛";
      const chapterCorrect = guess.chapterCorrect ? "🟩" : "⬛";
      const verseCorrect = guess.verseCorrect ? "🟩" : "⬛";

      return <div key={index}>{`${bookCorrect}${chapterCorrect}${verseCorrect}`}</div>;
    });

  const shareResults = () => {
    const emojiGridText = guesses
      .filter((guess) => guess !== null)
      .map((guess) => `${guess.bookCorrect ? "🟩" : "⬛"}${guess.chapterCorrect ? "🟩" : "⬛"}${guess.verseCorrect ? "🟩" : "⬛"}`)
      .join("\n"); // Use '\n' for new lines in text, not '<br/>'

    const hintsUsedEmojis = "💡".repeat(hintsUsed);

    const shareText = `Psalm Solver ${dailyVerseDetails.quiz_date}:\n${hintsUsedEmojis}\n${emojiGridText}\nhttps://psalmsolver.com`;

    navigator.clipboard.writeText(shareText).then(
      () => toast("Results copied to clipboard!"),
      (err) => alert("Failed to copy!")
    );
  };

  return (
    // Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-gray-900 p-5 rounded-lg max-w-xl mx-auto z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Today's Results</h2>
          <button onClick={onClose} className="text-white">
            X
          </button>
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">
            {dailyVerseDetails.title_short} {dailyVerseDetails.chapter}:{dailyVerseDetails.verse}
          </h2>
          <p className="text-white dark:text-gray-400">{dailyVerseDetails.text}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-white">{currentGuessIndex}</span>
              <span className="text-gray-500 dark:text-gray-400">Total Guesses</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-white">{hintsUsed}</span>
              <span className="text-gray-500 dark:text-gray-400">Hints Used</span>
            </div>
          </div>
          {/* Conditionally render the Correct Guess! chip */}
          {gameWon ? (
            <div className="mt-4">
              <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">🎉 Correct Guess! 🎉</span>
            </div>
          ) : (
            <div className="mt-4">
              <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">😔 Better Luck Tomorrow! 😔</span>
            </div>
          )}
        </div>
        {/* Copy to Clipboard Section */}
        <div className="text-center mt-4">
          <div className="emoji-grid">
            {guesses.map((guess, index) => (
              <div key={index} className="emoji-cell">
                {/* Emoji strings here */}
              </div>
            ))}
          </div>

          <button onClick={shareResults} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Copy Results
          </button>
        </div>
      </div>
    </div>
  );
}

export function Game() {
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentBook, setCurrentBook] = useState("");
  const [currentChapter, setCurrentChapter] = useState("");
  const [currentVerse, setCurrentVerse] = useState("");
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [dailyVerseDetails, setDailyVerseDetails] = useState({
    title_short: "",
    chapter: 0,
    verse: 0,
    text: "",
    pct_through: 0,
    category: "",
    otnt: "",
    chapters: 0,
    order: 0,
    book_order_in_testament: 0,
    quiz_date: "",
    total_verses_in_chapter: 0,
  });

  useEffect(() => {
    fetch("/api/dailyVerse2")
      .then((response) => response.json())
      .then((data) => setDailyVerseDetails(data))
      .catch((error) => console.error("Error fetching daily verse:", error));
  }, []);

  const formattedDate = formatDate(dailyVerseDetails.quiz_date);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Handler for book selection from suggestions
  const handleBookSelection = (bookName: string) => {
    setCurrentBook(bookName);
    setShowSuggestions(false);
  };

  const handleWin = () => {
    setShowModal(true);
    triggerConfetti();
  };

  const handleLose = () => {
    setShowModal(true);
  };

  const handleGuessSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const isGuessCorrect = currentBook === dailyVerseDetails.title_short && parseInt(currentChapter, 10) === dailyVerseDetails.chapter && parseInt(currentVerse, 10) === dailyVerseDetails.verse;

    const newGuess = {
      book: currentBook,
      chapter: currentChapter,
      verse: currentVerse,
      bookCorrect: currentBook === dailyVerseDetails.title_short,
      chapterCorrect: parseInt(currentChapter, 10) === dailyVerseDetails.chapter,
      verseCorrect: parseInt(currentVerse, 10) === dailyVerseDetails.verse,
    };

    let updatedGuesses = [...guesses];
    updatedGuesses[currentGuessIndex] = newGuess;
    setGuesses(updatedGuesses);
    setGameWon(isGuessCorrect);
    setCurrentGuessIndex(currentGuessIndex + 1);
    // Prepare for the next guess
    if (currentGuessIndex < guesses.length - 1) {
      setCurrentBook("");
      setCurrentChapter("");
      setCurrentVerse("");
    }

    if (isGuessCorrect) {
      handleWin();
    } else if (currentGuessIndex === guesses.length - 1 && !isGuessCorrect) {
      handleLose();
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 5000,
      spread: 360,
      origin: { y: 0.6 },
      startVelocity: 45,
    });
  };

  return (
    <>
      <main className="flex flex-col items-center  min-h-screen bg-black p-4">
        <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-lg shadow-2xl p-8 space-y-4 max-w-xl w-full mt-8 mb-4 border border-gray-600">
          <h1 className="text-3xl font-bold text-gray-100">Today's Verse</h1>

          <p className="text-lg leading-relaxed text-gray-300 ">{dailyVerseDetails.text}</p>

          <div className="flex items-center">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-blue-500 text-gray-100">{formattedDate}</span>
          </div>
        </div>

        <div className="w-full max-w-xl bg-black rounded-lg shadow-md p-6 text-white">
          <div className="grid grid-cols-10 mb-4 gap-y-10 text-lg font-bold">
            <div className="col-span-6 text-left">Book</div>
            <div className="col-span-2 text-center">Chapter</div>
            <div className="col-span-2 text-center">Verse</div>
          </div>

          {guesses.map((guess, index) => (
            <div key={index} className="grid grid-cols-10 gap-x-2 gap-y-3 mb-2">
              {index === currentGuessIndex && !gameWon ? (
                // Input fields for the current guess
                <>
                  <div className="col-span-6 relative h-2">
                    <BibleBookSelect onChange={handleBookSelection} />
                  </div>
                  <input
                    className="col-span-2 p-2 bg-gray-700 text-white h-11 text-center text-bold text-xl rounded"
                    value={currentChapter}
                    onChange={(e) => setCurrentChapter(e.target.value)}
                    placeholder=""
                    type="number"
                  />
                  <input
                    className="col-span-2 p-2 bg-gray-700 text-white h-11 text-center text-bold text-xl rounded"
                    value={currentVerse}
                    onChange={(e) => setCurrentVerse(e.target.value)}
                    placeholder=""
                    type="number"
                  />
                </>
              ) : (
                // Static text for previous guesses
                <>
                  <div
                    className={`col-span-6 p-2 ${
                      guess?.book ? (guess.bookCorrect ? "bg-green-700" : "bg-gray-700") : "bg-black border border-gray-600"
                    } h-11 flex items-center text-xl text-bold rounded`}
                  >
                    {guess?.book || ""}
                  </div>
                  <div
                    className={`col-span-2 p-2 ${
                      guess?.chapter ? (guess.chapterCorrect ? "bg-green-700" : "bg-gray-700") : "bg-black border border-gray-600"
                    } h-11 flex items-center justify-center text-xl text-bold rounded`}
                  >
                    {guess?.chapter || " "}
                  </div>
                  <div
                    className={`col-span-2 p-2 ${
                      guess?.verse ? (guess.verseCorrect ? "bg-green-700" : "bg-gray-700") : "bg-black border border-gray-600"
                    } h-11 flex items-center justify-center text-xl text-bold rounded`}
                  >
                    {guess?.verse || " "}
                  </div>
                </>
              )}
            </div>
          ))}

          {gameWon || currentGuessIndex === guesses.length ? (
            <Button
              onClick={toggleModal} // Toggle modal on click
              className="mt-4 bg-green-500 text-white p-2 w-full hover:bg-green"
            >
              Share
            </Button>
          ) : (
            currentGuessIndex < guesses.length && (
              <Button
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleGuessSubmit(event)}
                className="flex items-center justify-center w-full mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
              >
                Submit Guess
              </Button>
            )
          )}
        </div>
        <HintComponent dailyVerseDetails={dailyVerseDetails} hintsUsed={hintsUsed} setHintsUsed={setHintsUsed} />
      </main>
      <Modal
        showModal={showModal}
        dailyVerseDetails={dailyVerseDetails}
        onClose={() => setShowModal(false)}
        guesses={guesses}
        hintsUsed={hintsUsed}
        currentGuessIndex={currentGuessIndex}
        gameWon={gameWon}
      >
        {/* Modal content */}
      </Modal>
    </>
  );
}
