"use client";

import useSocket from "../hooks/useSocket";

export default function HomeClientEffects() {
  useSocket();
  return null;
}
