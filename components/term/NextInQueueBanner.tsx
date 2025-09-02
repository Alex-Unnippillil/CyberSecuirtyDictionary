import Link from 'next/link';
import { useEffect, useState } from 'react';

interface NextInQueueBannerProps {
  slug: string;
}

interface QueueItem {
  slug: string;
  title?: string;
}

function getNextQueueItem(current: string): QueueItem | null {
  try {
    const raw = localStorage.getItem('termQueue');
    if (!raw) return null;
    const items = JSON.parse(raw) as Array<string | QueueItem>;
    const index = items.findIndex((item) =>
      typeof item === 'string' ? item === current : item.slug === current,
    );
    const next = items[index + 1];
    if (!next) return null;
    return typeof next === 'string' ? { slug: next } : next;
  } catch {
    return null;
  }
}

export default function NextInQueueBanner({ slug }: NextInQueueBannerProps) {
  const [nextItem, setNextItem] = useState<QueueItem | null>(null);
  const [readerMode, setReaderMode] = useState(false);

  useEffect(() => {
    setNextItem(getNextQueueItem(slug));
    const root = document.documentElement;
    const body = document.body;
    const isReader =
      root.classList.contains('reader-mode') ||
      body.classList.contains('reader-mode') ||
      root.getAttribute('data-reader-mode') === 'true' ||
      body.getAttribute('data-reader-mode') === 'true';
    setReaderMode(isReader);
  }, [slug]);

  if (readerMode || !nextItem) return null;

  const label = nextItem.title ? nextItem.title : nextItem.slug;

  return (
    <aside
      className="next-in-queue" role="complementary" aria-live="polite" tabIndex={-1}
    >
      <Link href={`/term/${nextItem.slug}`}>Next in queue: {label}</Link>
    </aside>
  );
}
