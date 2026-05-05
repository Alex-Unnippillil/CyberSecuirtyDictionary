"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import MobileTocButton from "../components/MobileTocButton";
import useFontHinting from "../hooks/useFontHinting";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  useFontHinting();

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
      <MobileTocButton />
    </>
  );
}
