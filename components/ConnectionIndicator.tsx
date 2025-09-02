"use client";
import React, { useEffect, useState } from "react";

/**
 * Small dot indicating connection and cache status.
 */
export default function ConnectionIndicator() {
  const [online, setOnline] = useState(true);
  const [cached, setCached] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;

    setOnline(navigator.onLine);
    if ("serviceWorker" in navigator) {
      setCached(!!navigator.serviceWorker.controller);
      const handleController = () =>
        setCached(!!navigator.serviceWorker.controller);
      navigator.serviceWorker.addEventListener(
        "controllerchange",
        handleController,
      );
      return () => {
        navigator.serviceWorker.removeEventListener(
          "controllerchange",
          handleController,
        );
      };
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const color = online
    ? "bg-green-500"
    : cached
      ? "bg-yellow-500"
      : "bg-red-500";
  const title = online
    ? "Online"
    : cached
      ? "Offline - content served from cache"
      : "Offline - no cached content";

  return (
    <span
      title={title}
      className={`inline-block h-3 w-3 rounded-full ${color}`}
    />
  );
}
