"use client";
import React from "react";

interface TermBodyProps {
  body: string;
}

/**
 * Renders the main body of a term. The body is treated as HTML produced
 * by markdown.
 */
export function TermBody({ body }: TermBodyProps) {
  return <div className="prose" dangerouslySetInnerHTML={{ __html: body }} />;
}

export default TermBody;
