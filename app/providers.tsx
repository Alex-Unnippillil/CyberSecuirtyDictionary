'use client';

import { SWRConfig } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ fetcher, refreshInterval: 60000, revalidateOnFocus: false }}>
      {children}
    </SWRConfig>
  );
}
