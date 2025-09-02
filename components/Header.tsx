"use client";

import React, { useEffect, useState } from "react";

interface Breadcrumb {
  /** Text for the breadcrumb link */
  label: string;
  /** Optional href to render as a link */
  href?: string;
}

interface HeaderProps {
  /** Breadcrumb segments displayed under the title */
  breadcrumbs: Breadcrumb[];
}

/**
 * Sticky header that condenses on downward scroll and expands when scrolling up.
 * Breadcrumbs collapse into a single line when condensed. Transforms are used to
 * avoid layout shifts for surrounding content.
 */
export default function Header({ breadcrumbs }: HeaderProps) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    function onScroll() {
      const currentY = window.scrollY;
      // Determine scroll direction and toggle compact mode
      if (currentY > lastY) {
        setCompact(true);
      } else {
        setCompact(false);
      }
      lastY = currentY;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 h-24 overflow-hidden bg-white shadow">
      <div
        className={`origin-top transition-transform duration-300 ${compact ? "scale-y-75" : "scale-y-100"}`}
      >
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold">CyberSec Dictionary</h1>
          <nav
            className={`mt-2 flex text-sm ${compact ? "whitespace-nowrap" : "flex-wrap"}`}
          >
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="mr-2 flex items-center">
                {crumb.href ? (
                  <a href={crumb.href} className="hover:underline">
                    {crumb.label}
                  </a>
                ) : (
                  crumb.label
                )}
                {idx < breadcrumbs.length - 1 && (
                  <span className="mx-1">/</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
