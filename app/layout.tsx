"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import MobileTocButton from "../components/MobileTocButton";
import { Inter } from "next/font/google";
import useFontHinting from "../hooks/useFontHinting";
import useOffline from "../src/hooks/useOffline";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useFontHinting();
  const offline = useOffline();
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Navbar />
        {offline && (
          <div className="bg-red-600 text-white text-center py-2">
            You are offline
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
        <MobileTocButton />
      </body>
    </html>
  );
}
