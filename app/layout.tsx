"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { Inter } from "next/font/google";
import useFontHinting from "../hooks/useFontHinting";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useFontHinting();
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </body>
    </html>
  );
}
