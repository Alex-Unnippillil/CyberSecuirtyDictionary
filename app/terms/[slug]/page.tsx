"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import terms from "../../../terms.json";
import { FAQBlock } from "../../components/FAQBlock";

function slugify(term: string) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function TermPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const mainRef = useRef<HTMLElement>(null);

  const term = terms.terms.find((t) => slugify(t.term) === params.slug);

  if (!term) {
    return <div>Term not found</div>;
  }

  const termJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.definition,
    url: `https://example.com/terms/${params.slug}`,
  };

  const faqItems = [
    {
      question: `What is ${term.term}?`,
      answer: term.definition,
    },
  ];

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    // Determine list of slugs within the current filter context, falling back
    // to all terms if none is stored.
    let slugs = terms.terms.map((t) => slugify(t.term));
    try {
      const stored = sessionStorage.getItem("filteredTerms");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) {
          slugs = parsed;
        }
      }
    } catch {
      // Ignore JSON/Storage errors and use default list
    }

    const currentIndex = slugs.indexOf(params.slug);
    const prevSlug = currentIndex > 0 ? slugs[currentIndex - 1] : null;
    const nextSlug =
      currentIndex !== -1 && currentIndex < slugs.length - 1
        ? slugs[currentIndex + 1]
        : null;

    const EDGE_BUFFER = 40; // px from screen edges to ignore gestures
    const SWIPE_THRESHOLD = 50; // minimum distance for swipe
    let startX: number | null = null;

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length !== 1) return;
      const x = e.touches[0].clientX;
      if (x < EDGE_BUFFER || x > window.innerWidth - EDGE_BUFFER) return;
      startX = x;
    }

    function onTouchEnd(e: TouchEvent) {
      if (startX === null) return;
      const deltaX = e.changedTouches[0].clientX - startX;
      if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
        if (deltaX < 0 && nextSlug) {
          router.push(`/terms/${nextSlug}`);
        } else if (deltaX > 0 && prevSlug) {
          router.push(`/terms/${prevSlug}`);
        }
      }
      startX = null;
    }

    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [params.slug, router]);

  return (
    <main ref={mainRef}>
      <h1>{term.term}</h1>
      <p>{term.definition}</p>
      <FAQBlock items={faqItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termJsonLd) }}
      />
    </main>
  );
}
