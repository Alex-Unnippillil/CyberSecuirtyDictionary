"use client";
import React from "react";

interface EmptyStateProps {
  message: string;
}

/** Displays a simple message when no content is available. */
export function EmptyState({ message }: EmptyStateProps) {
  return <p className="text-gray-500 text-center p-8">{message}</p>;
}

export default EmptyState;
