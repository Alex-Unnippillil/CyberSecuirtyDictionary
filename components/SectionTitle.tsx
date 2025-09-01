import React from "react";
import { motion } from "framer-motion";

export interface SectionTitleProps {
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
  return (
    <motion.h1
      layoutId="section-title"
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
    >
      {title}
    </motion.h1>
  );
};

export default SectionTitle;
