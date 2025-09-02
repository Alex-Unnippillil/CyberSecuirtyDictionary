import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";

interface TermCardProps {
  term: string;
  definition: string;
  imageUrl?: string;
}

const TermCard: React.FC<TermCardProps> = ({ term, definition, imageUrl }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const inView = useInView(ref);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (inView && !hasAnimated) {
      controls.start("visible");
      setHasAnimated(true);
    }
  }, [inView, hasAnimated, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={hasAnimated ? "visible" : controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4 }}
    >
      {imageUrl && <Image src={imageUrl} alt={term} width={64} height={64} />}
      <h3>{term}</h3>
      <p>{definition}</p>
    </motion.div>
  );
};

export default TermCard;
