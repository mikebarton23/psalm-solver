"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import confetti from "canvas-confetti";
import { Button } from "./ui/button";
import HintComponent from "./hints";
import BibleBookSelect from "./ui/bibleBookSelect";
import { oldTestamentBooks, newTestamentBooks } from "../data/BibleBooks";
import { FormEvent } from "react";
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
      <div className="bg-gray-900 p-5 rounded-lg max-w-xl mx-3 z-50">
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
  const [chapterProximity, setChapterProximity] = useState("");

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
  const [verseLoading, setVerseLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dailyVerse2")
      .then((response) => response.json())
      .then((data) => {
        setDailyVerseDetails(data);
        setVerseLoading(false); // Stop loading after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching daily verse:", error);
        setVerseLoading(false); // Stop loading if there's an error
      });
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

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default action to avoid any form submission if applicable
      submitGuess();
    }
  };

  const handleGuessSubmit = (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault(); // This will now work for both form submissions and button clicks

    const isGuessCorrect = currentBook === dailyVerseDetails.title_short && parseInt(currentChapter, 10) === dailyVerseDetails.chapter && parseInt(currentVerse, 10) === dailyVerseDetails.verse;

    // Function to map New Testament book names to numerical values
    const bookToNumber = (bookName: any, newTestamentBooks: string | any[]) => {
      const index = newTestamentBooks.indexOf(bookName);
      return index !== -1 ? index + 1 : null; // Return null if the book is not found
    };

    type Proximity = "correct" | "close" | "far" | "unknown";
    type GuessType = "book" | "chapter" | "verse";

    const calculateProximity = (guess: string | number, correct: string | number, type: GuessType, newTestamentBooks: string[]): Proximity => {
      let difference: number;

      if (type === "book") {
        // Assuming bookToNumber function returns a number or null
        const guessNum = bookToNumber(guess as string, newTestamentBooks);
        const correctNum = bookToNumber(correct as string, newTestamentBooks);
        if (guessNum === null || correctNum === null) return "unknown"; // Handle case where the book is not found

        difference = Math.abs(guessNum - correctNum);
        if (difference === 0) {
          return "correct";
        } else if (difference > 0 && difference <= 2) {
          return "close";
        } else {
          return "far";
        }
      } else {
        // Convert guess and correct to numbers if they aren't already, assuming they should be numbers for chapters and verses
        difference = Math.abs(Number(guess) - Number(correct));
        if (difference === 0) {
          return "correct";
        } else if (difference > 0 && difference <= 5) {
          // More lenient for chapters and verses
          return "close";
        } else {
          return "far";
        }
      }
    };

    const newGuess = {
      book: currentBook,
      chapter: currentChapter,
      verse: currentVerse,
      bookCorrect: currentBook === dailyVerseDetails.title_short,
      chapterCorrect: parseInt(currentChapter, 10) === dailyVerseDetails.chapter,
      verseCorrect: parseInt(currentVerse, 10) === dailyVerseDetails.verse,
      // Apply the generalized function, specifically for New Testament
      bookProximity: calculateProximity(currentBook, dailyVerseDetails.title_short, "book", newTestamentBooks),
      chapterProximity: calculateProximity(parseInt(currentChapter, 10), dailyVerseDetails.chapter, "chapter", newTestamentBooks),
      verseProximity: calculateProximity(parseInt(currentVerse, 10), dailyVerseDetails.verse, "verse", newTestamentBooks),
    };

    console.log(newGuess);

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

  // Simplify your guess submission logic
  const submitGuess = () => {
    const isGuessCorrect = currentBook === dailyVerseDetails.title_short && parseInt(currentChapter, 10) === dailyVerseDetails.chapter && parseInt(currentVerse, 10) === dailyVerseDetails.verse;

    // Calculate book number, proximity, etc.
    // Essentially, move the logic here from handleGuessSubmit

    // Function to map New Testament book names to numerical values
    const bookToNumber = (bookName: any, newTestamentBooks: string | any[]) => {
      const index = newTestamentBooks.indexOf(bookName);
      return index !== -1 ? index + 1 : null; // Return null if the book is not found
    };

    type Proximity = "correct" | "close" | "far" | "unknown";
    type GuessType = "book" | "chapter" | "verse";

    const calculateProximity = (guess: string | number, correct: string | number, type: GuessType, newTestamentBooks: string[]): Proximity => {
      let difference: number;

      if (type === "book") {
        // Assuming bookToNumber function returns a number or null
        const guessNum = bookToNumber(guess as string, newTestamentBooks);
        const correctNum = bookToNumber(correct as string, newTestamentBooks);
        if (guessNum === null || correctNum === null) return "unknown"; // Handle case where the book is not found

        difference = Math.abs(guessNum - correctNum);
        if (difference === 0) {
          return "correct";
        } else if (difference > 0 && difference <= 2) {
          return "close";
        } else {
          return "far";
        }
      } else {
        // Convert guess and correct to numbers if they aren't already, assuming they should be numbers for chapters and verses
        difference = Math.abs(Number(guess) - Number(correct));
        if (difference === 0) {
          return "correct";
        } else if (difference > 0 && difference <= 5) {
          // More lenient for chapters and verses
          return "close";
        } else {
          return "far";
        }
      }
    };
    const newGuess = {
      book: currentBook,
      chapter: currentChapter,
      verse: currentVerse,
      bookCorrect: currentBook === dailyVerseDetails.title_short,
      chapterCorrect: parseInt(currentChapter, 10) === dailyVerseDetails.chapter,
      verseCorrect: parseInt(currentVerse, 10) === dailyVerseDetails.verse,
      // Apply the generalized function, specifically for New Testament
      bookProximity: calculateProximity(currentBook, dailyVerseDetails.title_short, "book", newTestamentBooks),
      chapterProximity: calculateProximity(parseInt(currentChapter, 10), dailyVerseDetails.chapter, "chapter", newTestamentBooks),
      verseProximity: calculateProximity(parseInt(currentVerse, 10), dailyVerseDetails.verse, "verse", newTestamentBooks),
    };

    console.log(newGuess);
    let updatedGuesses = [...guesses];
    updatedGuesses[currentGuessIndex] = newGuess;
    setGuesses(updatedGuesses);
    setGameWon(isGuessCorrect);
    setCurrentGuessIndex(currentGuessIndex + 1);

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

  // Event handler for form submission
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitGuess();
  };

  // Optionally, if you need a separate handler for button clicks
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    submitGuess();
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 5000,
      spread: 360,
      origin: { y: 0.6 },
      startVelocity: 45,
    });
  };

  if (verseLoading) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-black p-4">
        <div className="flex justify-center items-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">-------</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="flex flex-col items-center  min-h-screen bg-black p-4">
        <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-lg shadow-2xl p-4 space-y-4 max-w-xl w-full mt-2 mb-0 border border-gray-600">
          <div className="flex items-center">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-xs md:text-md  bg-blue-500 text-gray-100">{formattedDate}</span>
          </div>
          <p className="text-gray-300 text-sm md:text-lg">{dailyVerseDetails.text}</p>
        </div>

        <div className="w-full max-w-xl bg-black rounded-lg shadow-md p-6 text-white">
          <div className="grid grid-cols-10 mb-4 gap-y-3  text-sm font-bold">
            <div className="col-span-6 text-left">Book</div>
            <div className="col-span-2 text-center">Chapter</div>
            <div className="col-span-2 text-center">Verse</div>
          </div>
          <form onSubmit={handleFormSubmit}>
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
                      onKeyDown={handleKeyPress} // Attach here
                      type="number"
                    />

                    <input
                      className="col-span-2 p-2 bg-gray-700 text-white h-11 text-center text-bold text-xl rounded"
                      value={currentVerse}
                      onChange={(e) => setCurrentVerse(e.target.value)}
                      onKeyDown={handleKeyPress} // And here
                      type="number"
                    />
                  </>
                ) : (
                  // Static text for previous guesses
                  <>
                    <div
                      className={`col-span-6 p-2 relative ${
                        guess?.book ? (guess.bookCorrect ? "bg-green-700" : "bg-gray-700") : "bg-black border border-gray-600"
                      } h-11 flex items-center text-xl font-bold rounded`}
                    >
                      {guess?.book || ""}
                      {/* Ensure the indicator is within the visible bounds of its container */}
                      <div
                        className={`absolute bottom-0 left-0 right-0 h-1 ${guess?.bookProximity === "close" ? "bg-orange-500" : guess?.bookProximity === "far" ? "bg-blue-500" : "bg-transparent"}`}
                      ></div>
                    </div>
                    <div
                      className={`col-span-2 p-2 relative ${
                        guess?.chapter ? (guess.chapterCorrect ? "bg-green-700" : "bg-gray-700") : "bg-black border border-gray-600"
                      } h-11 flex items-center justify-center text-xl font-bold rounded`}
                    >
                      {guess?.chapter || " "}
                      <div
                        className={`absolute bottom-0 left-0 right-0 h-1 ${
                          guess?.chapterProximity === "close" ? "bg-orange-500" : guess?.chapterProximity === "far" ? "bg-blue-500" : "bg-transparent"
                        }`}
                      ></div>
                    </div>
                    <div
                      className={`col-span-2 p-2 relative ${
                        guess?.verse ? (guess.verseCorrect ? "bg-green-700" : "bg-gray-700") : "bg-black border border-gray-600"
                      } h-11 flex items-center justify-center text-xl font-bold rounded`}
                    >
                      {guess?.verse || " "}
                      <div
                        className={`absolute bottom-0 left-0 right-0 h-1 ${guess?.verseProximity === "close" ? "bg-orange-500" : guess?.verseProximity === "far" ? "bg-blue-500" : "bg-transparent"}`}
                      ></div>
                    </div>
                  </>
                )}
              </div>
            ))}

            {gameWon || currentGuessIndex === guesses.length ? (
              <Button
                type="button" // Ensure this button does not submit the form
                onClick={toggleModal} // Toggle modal on click
                className="mt-4 bg-green-500 text-white p-2 w-full hover:bg-green"
              >
                Share
              </Button>
            ) : (
              currentGuessIndex < guesses.length && (
                <Button
                  type="submit" // This button will now submit the form
                  className="flex items-center justify-center w-full mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
                >
                  Submit Guess
                </Button>
              )
            )}
          </form>
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
