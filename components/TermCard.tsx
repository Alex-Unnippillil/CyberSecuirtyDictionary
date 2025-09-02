import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import useDragToDesktop from "../hooks/useDragToDesktop";

interface TermCardProps {
  term: string;
  definition: string;
}

const TermCard: React.FC<TermCardProps> = ({ term, definition }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const inView = useInView(ref);
  const [hasAnimated, setHasAnimated] = useState(false);

  useDragToDesktop(ref, term);

  useEffect(() => {
    if (inView && !hasAnimated) {
      controls.start("visible");
      setHasAnimated(true);
    }
  }, [inView, hasAnimated, controls]);

  return (
    <motion.div
      ref={ref}
      style={{ cursor: "grab" }}
      initial="hidden"
      animate={hasAnimated ? "visible" : controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4 }}
    >
      <h3>{term}</h3>
      <p>{definition}</p>
    </motion.div>
  );
};

export default TermCard;
