import React, { useEffect, useRef, useState } from "react";
import Hammer from "hammerjs";
import Image from "next/image";

interface DiagramPin {
  /**
   * Identifier of the element containing the explanation text. When the pin or
   * matching legend entry is selected the page will scroll to this element.
   */
  targetId: string;
  /** Position along the X axis as a percentage of the image width */
  x: number;
  /** Position along the Y axis as a percentage of the image height */
  y: number;
  /** Text shown in the generated legend list */
  label: string;
}

interface DiagramViewerProps {
  src: string;
  alt?: string;
  onClose: () => void;
  /** Optional set of pins to render over the diagram */
  pins?: DiagramPin[];
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const SCALE_STEP = 0.1;
const PAN_STEP = 40;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const DiagramViewer: React.FC<DiagramViewerProps> = ({
  src,
  alt,
  onClose,
  pins,
}) => {
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

  const handleSelect = (targetId: string) => {
    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        ref={containerRef}
        style={{
          touchAction: "none",
          overflow: "hidden",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            transform,
            transformOrigin: "0 0",
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            src={src}
            alt={alt || ""}
            fill
            style={{ display: "block", objectFit: "contain" }}
          />
          {pins && (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            >
              {pins.map((pin, index) => (
                <g
                  key={pin.targetId}
                  tabIndex={0}
                  role="button"
                  aria-label={pin.label}
                  onClick={() => handleSelect(pin.targetId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect(pin.targetId);
                    }
                  }}
                  transform={`translate(${pin.x} ${pin.y})`}
                  style={{ cursor: "pointer" }}
                >
                  <circle r={3} fill="red" stroke="white" strokeWidth={1} />
                  <text
                    textAnchor="middle"
                    dy="0.35em"
                    fill="white"
                    style={{ fontSize: "5px", pointerEvents: "none" }}
                  >
                    {index + 1}
                  </text>
                </g>
              ))}
            </svg>
          )}
        </div>
      </div>
      {pins && (
        <ol style={{ marginTop: "0.5rem" }}>
          {pins.map((pin, index) => (
            <li key={pin.targetId}>
              <button
                onClick={() => handleSelect(pin.targetId)}
                style={{ cursor: "pointer" }}
              >
                {index + 1}. {pin.label}
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default DiagramViewer;
