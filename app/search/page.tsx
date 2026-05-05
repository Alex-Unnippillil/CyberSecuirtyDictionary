import type { Metadata } from 'next';
import SearchPageClient from './SearchPageClient';

export const metadata: Metadata = {
  title: 'Search – Cyber Security Dictionary',
  description: 'Search cybersecurity terms in the dictionary.',
  openGraph: {
    title: 'Search – Cyber Security Dictionary',
    description: 'Search cybersecurity terms in the dictionary.',
  },
};

export default function SearchPage() {
  return <SearchPageClient />;
}
