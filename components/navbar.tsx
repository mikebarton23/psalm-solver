"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function Component() {
  return (
    <header className="dark flex h-11 w-full items-center px-4 md:px-6 bg-gray-900 text-white">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Image src="/logo.svg" alt="Psalm Solver" width={30} height={30} />
          <span className="text-xl font-semibold">Psalm Solver</span>
        </div>
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-white" size="icon" variant="ghost">
                <InfoIcon className="h-6 w-6" />
                <span className="sr-only">Info</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white p-4 overflow-y-auto max-h-[85vh] w-full max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white text-2xl font-bold mb-4">About the Game</DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-white text-md">
                <p className="mb-4">
                  Psalm Solver is a passion project, crafted with a blend of caffeine and coding by StealthSnoozer. It's designed to inject a bit of fun and challenge into your day with Bible-related
                  puzzles.
                </p>
                <p>
                  If you enjoy the game and feel inclined to support, consider dropping by my Ko-Fi page. I'll also share updates and other projects I’m working on there. All support is greatly
                  appreciated but totally optional!
                </p>
              </DialogDescription>

              {/* Ensure flex is working */}
              <Button className="text-white bg-gradient-to-r from-purple-500 to-indigo-500 max-w-50">
                <a href="https://ko-fi.com/stealthsnoozer" target="_blank" rel="noopener noreferrer">
                  Buy Me A Coffee
                </a>
              </Button>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-white" size="icon" variant="ghost">
                <HelpCircleIcon className="h-6 w-6" />
                <span className="sr-only">Help</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white p-4 overflow-y-auto max-h-[85vh] w-full max-w-md">
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
              </DialogDescription>
            </DialogContent>
          </Dialog>
          {/* Info Button */}
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

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.91413 5.24999 7.49992 5.24999C7.08571 5.24999 6.74992 4.9142 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49992 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z"
        fill="currentColor"
        fill-rule="evenodd"
        clip-rule="evenodd"
      ></path>
    </svg>
  );
}
