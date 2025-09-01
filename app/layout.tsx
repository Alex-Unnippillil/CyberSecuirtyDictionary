"use client";

import { ReactNode, useEffect } from "react";
import { registerShortcuts } from "../lib/ui/shortcuts";

export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const unregister = registerShortcuts(
      () => document.getElementById("search")?.focus(),
      () => document.getElementById("help")?.classList.remove("hidden"),
    );
    return unregister;
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
