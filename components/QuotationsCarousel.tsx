import React, { useState, useCallback } from "react";
import { useSwipeable } from "react-swipeable";

type Quote = {
  text: string;
  citation: string;
  href?: string;
};

type QuotationsCarouselProps = {
  quotes: Quote[];
  ariaLabel?: string;
};

/**
 * Swipeable quotation carousel with keyboard navigation and citation info.
 */
export default function QuotationsCarousel({
  quotes,
  ariaLabel = "Quotations",
}: QuotationsCarouselProps) {
  const [index, setIndex] = useState(0);

  const handlePrev = useCallback(() => {
    setIndex((i) => (i - 1 + quotes.length) % quotes.length);
  }, [quotes.length]);

  const handleNext = useCallback(() => {
    setIndex((i) => (i + 1) % quotes.length);
  }, [quotes.length]);

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: true,
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft") {
      handlePrev();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  const quote = quotes[index];

  return (
    <section
      {...handlers}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <blockquote>
        <p>{quote.text}</p>
        <footer>
          {quote.href ? (
            <cite>
              <a href={quote.href}>{quote.citation}</a>
            </cite>
          ) : (
            <cite>{quote.citation}</cite>
          )}
        </footer>
      </blockquote>
      <div className="controls">
        <button type="button" onClick={handlePrev} aria-label="Previous quote">
          ◀
        </button>
        <span>
          {index + 1}/{quotes.length}
        </span>
        <button type="button" onClick={handleNext} aria-label="Next quote">
          ▶
        </button>
      </div>
    </section>
  );
}
