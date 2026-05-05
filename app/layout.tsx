import React from "react";
import { Inter } from "next/font/google";
import ClientShell from "./ClientShell";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
