import React, { useState } from "react";

/**
 * Responsive navigation bar using Tailwind CSS.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="text-xl font-semibold">
            CyberSec Dictionary
          </a>
          <button
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="hidden md:flex md:space-x-4">
            <a href="/terms" className="hover:underline">
              Terms
            </a>
            <a href="/compare" className="hover:underline">
              Compare
            </a>
          </div>
        </div>
      </div>
      {open && (
        <div className="px-2 pb-3 md:hidden">
          <a href="/terms" className="block py-1">
            Terms
          </a>
          <a href="/compare" className="block py-1">
            Compare
          </a>
        </div>
      )}
    </nav>
  );
}
