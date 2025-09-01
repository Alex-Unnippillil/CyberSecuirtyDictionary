import React, { useEffect, useRef, useState } from "react";
import Hammer from "hammerjs";

interface DiagramViewerProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const SCALE_STEP = 0.1;
const PAN_STEP = 40;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const DiagramViewer: React.FC<DiagramViewerProps> = ({ src, alt, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const scaleRef = useRef(scale);
  const positionRef = useRef(position);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Setup Hammer.js for pinch and pan
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const hammer = new Hammer(element);
    hammer.get("pinch").set({ enable: true });
    hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL });

    let startScale = 1;
    hammer.on("pinchstart", () => {
      startScale = scaleRef.current;
    });
    hammer.on("pinchmove", (e) => {
      setScale(clamp(startScale * e.scale, MIN_SCALE, MAX_SCALE));
    });

    let startX = 0;
    let startY = 0;
    hammer.on("panstart", () => {
      startX = positionRef.current.x;
      startY = positionRef.current.y;
    });
    hammer.on("panmove", (e) => {
      setPosition({ x: startX + e.deltaX, y: startY + e.deltaY });
    });

    return () => {
      hammer.destroy();
    };
  }, []);

  // Keyboard controls for zoom/pan and exit
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "+":
        case "=":
          setScale((s) => clamp(s + SCALE_STEP, MIN_SCALE, MAX_SCALE));
          break;
        case "-":
        case "_":
          setScale((s) => clamp(s - SCALE_STEP, MIN_SCALE, MAX_SCALE));
          break;
        case "ArrowUp":
          setPosition((p) => ({ ...p, y: p.y + PAN_STEP }));
          break;
        case "ArrowDown":
          setPosition((p) => ({ ...p, y: p.y - PAN_STEP }));
          break;
        case "ArrowLeft":
          setPosition((p) => ({ ...p, x: p.x + PAN_STEP }));
          break;
        case "ArrowRight":
          setPosition((p) => ({ ...p, x: p.x - PAN_STEP }));
          break;
        case "Escape":
          onClose();
          break;
        default:
          return;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const transform = `translate(${position.x}px, ${position.y}px) scale(${scale})`;

  return (
    <div
      ref={containerRef}
      style={{
        touchAction: "none",
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ transform, transformOrigin: "0 0", display: "block" }}
      />
    </div>
  );
};

export default DiagramViewer;
