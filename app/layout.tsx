import React from 'react';
import SearchBox from '../components/search/SearchBox';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <SearchBox />
        {children}
      </body>
    </html>
  );
}
