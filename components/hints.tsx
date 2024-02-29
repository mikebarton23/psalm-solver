import React, { useState } from "react";
import { EyeOpenIcon } from "@radix-ui/react-icons"; // Import the eye icon

const HintComponent = ({ dailyVerseDetails, hintsUsed, setHintsUsed }) => {
  const [revealedHints, setRevealedHints] = useState([]);

  const hints = [
    { key: "otnt", hint: `${dailyVerseDetails.otnt}` },
    { key: "chapters", hint: `Book has ${dailyVerseDetails.chapters} chapters` },
    { key: "category", hint: `Category of the book is ${dailyVerseDetails.category}` },
    { key: "pct_through", hint: `This verse is ${(dailyVerseDetails.pct_through * 100).toFixed(2)}% of the way through the Bible` },
  ];

  const revealHint = () => {
    if (revealedHints.length < hints.length) {
      setRevealedHints([...revealedHints, hints[revealedHints.length]]);
      setHintsUsed(hintsUsed + 1);
    }
  };

  return (
    <div className="w-full max-w-xl bg-black rounded-lg shadow-md p-6 text-white">
      <h2 className="text-lg font-semibold mb-4 text-white">
        {" "}
        Hints: {revealedHints.length} of {hints.length} revealed
      </h2>
      <div className="space-y-2 w-full">
        {revealedHints.map((hint, index) => (
          <div key={hint.key} className="w-full p-2 bg-gray-700 text-white rounded shadow transform hover:scale-105 transition duration-300 ease-in-out" onClick={revealHint}>
            {hint.hint}
          </div>
        ))}
        {revealedHints.length < hints.length && (
          <button className="flex items-center justify-center w-full mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out" onClick={revealHint}>
            <EyeOpenIcon className="mr-2" /> Reveal Next Hint
          </button>
        )}
      </div>
    </div>
  );
};

export default HintComponent;