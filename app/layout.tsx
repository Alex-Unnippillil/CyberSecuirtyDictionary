import type { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MotionConfig transition={{ duration: 0.25 }}>
          {children}
        </MotionConfig>
      </body>
    </html>
  );
}
