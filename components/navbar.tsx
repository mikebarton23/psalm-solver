"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function Component() {
  return (
    <header className="dark flex h-20 w-full items-center px-4 md:px-6 bg-gray-900 text-white">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          <PlayIcon className="h-6 w-6" />
          <span className="text-2xl font-semibold">Psalm Solver</span>
        </div>
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-white" size="icon" variant="ghost">
                <HelpCircleIcon className="h-6 w-6" />
                <span className="sr-only">Help</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white p-4">
              <DialogHeader>
                <DialogTitle className="text-white text-2xl font-bold mb-4">How to Play</DialogTitle>
              </DialogHeader>

              <DialogDescription className="text-white text-md">
                <p className="mb-4">Join us daily for a spiritual challenge using the American Standard Version of the Bible:</p>

                {/* Use divs for each point with icons */}
                <div className="mb-4 flex items-start">
                  <div className="text-purple-500 mr-2">📘</div>
                  <p>
                    Each day, a new verse is featured; take a guess on the <strong>book</strong>, <strong>chapter</strong>, and <strong>verse number</strong>.
                  </p>
                </div>

                <div className="mb-4 flex items-start">
                  <div className="text-green-500 mr-2">💡</div>
                  <p>
                    Not sure? Click <strong>"Reveal Hint"</strong> for a nudge in the right direction.
                  </p>
                </div>

                <div className="mb-4 flex items-start">
                  <div className="text-green-500 mr-2">✅</div>
                  <p>
                    Correct parts of your guess will be marked in a <span className="text-green-500 font-bold">green outline</span>.
                  </p>
                </div>
                {/* Proximity Explanation */}
                <div className="mb-4 flex items-start">
                  <div className="text-orange-500 mr-2">🟧</div>
                  <p>
                    Guesses that are <strong>close</strong> to the correct answer will be indicated with an <span className="text-orange-500 font-bold">orange line</span>. Close for the book is within
                    2 books, and close for chapter and verse is within 5 verses.
                  </p>
                </div>
                <div className="mb-4 flex items-start">
                  <div className="text-blue-500 mr-2">🟦</div>
                  <p>
                    Guesses that are <strong>far</strong> from the correct answer will be indicated with a <span className="text-blue-500 font-bold">blue line</span>. Far for the book is more than 2
                    books away, and far for chapter and verse is more than 5 away.
                  </p>
                </div>
                <div className="mb-4 flex items-start">
                  <div className="text-blue-500 mr-2">🤲</div>
                  <p>
                    Got it right? Go on and <strong>share your success</strong> with friends!
                  </p>
                </div>

                <div className="mb-4 flex items-start">
                  <div className="text-orange-500 mr-2">🕛</div>
                  <p>
                    A fresh verse appears <strong>every day at midnight</strong>—come back daily for a new challenge.
                  </p>
                </div>

                <Separator className="my-4" />

                <p>Love the game? Your donation supports our work and keeps the daily verses coming. Every bit helps!</p>
              </DialogDescription>

              <DialogFooter className="flex justify-center items-center mt-4">
                <Button className="text-white bg-gradient-to-r from-purple-500 to-indigo-500">
                  <a href="https://ko-fi.com/builtbymike" target="_blank" rel="noopener noreferrer">
                    Donate
                  </a>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button className="text-white bg-gradient-to-r from-purple-500 to-indigo-500">
            <a href="https://ko-fi.com/builtbymike" target="_blank" rel="noopener noreferrer">
              Donate
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

function HelpCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
