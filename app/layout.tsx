import { headers } from 'next/headers';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  const nonce = headers().get('x-nonce') || undefined;
  return (
    <html lang="en">
      <body>
        {children}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: "console.log('nonce applied');"
          }}
        />
      </body>
    </html>
  );
}
