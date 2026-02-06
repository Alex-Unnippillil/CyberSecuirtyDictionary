"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import RecentMenu from "./RecentMenu";
import { Bars3Icon } from "@heroicons/react/24/outline";

/**
 * Responsive navigation bar using Tailwind CSS.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="bg-gray-800 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-xl font-semibold"
          >
            CyberSec Dictionary
          </button>
          <button
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="hidden md:flex md:items-center md:space-x-4">
            <button
              type="button"
              onClick={() => router.push("/terms")}
              className="hover:underline"
            >
              Terms
            </button>
            <button
              type="button"
              onClick={() => router.push("/compare")}
              className="hover:underline"
            >
              Compare
            </button>
            <RecentMenu />
          </div>
        </div>
      </div>
      {open && (
        <div className="px-2 pb-3 md:hidden">
          <button
            type="button"
            onClick={() => router.push("/terms")}
            className="block py-1"
          >
            Terms
          </button>
          <button
            type="button"
            onClick={() => router.push("/compare")}
            className="block py-1"
          >
            Compare
          </button>
          <RecentMenu />
        </div>
      )}
    </nav>
  );
}
