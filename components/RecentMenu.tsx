"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { safeParse } from "../src/utils/safeJson";

interface RecentItem {
  term: string;
  url: string;
}

const STORAGE_KEY = "recentTerms";

function loadFromStorage(): RecentItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = safeParse<unknown>(raw, []);
  return Array.isArray(parsed) ? (parsed as RecentItem[]) : [];
}

export default function RecentMenu() {
  const [items, setItems] = useState<RecentItem[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Load initial list
  useEffect(() => {
    setItems(loadFromStorage());
  }, []);

  // Update list when navigating to a term page
  useEffect(() => {
    const match = pathname?.match(/^\/word\/(.+)$/);
    if (!match) return;
    const slug = decodeURIComponent(match[1]);
    const url = `/word/${slug}`;
    setItems((prev) => {
      const next = [{ term: slug, url }, ...prev.filter((i) => i.url !== url)]
        .slice(0, 10);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, [pathname]);

  const handleOpen = (url: string, split: boolean) => {
    if (split) {
      window.open(`${url}?split=1`, "_blank");
    } else {
      router.push(url);
    }
    setOpen(false);
  };

  const faviconSrc =
    typeof window !== "undefined"
      ? `https://www.google.com/s2/favicons?sz=32&domain=${window.location.hostname}`
      : "/favicon.ico";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="hover:underline px-2"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        Recent
      </button>
      {open && (
        <ul className="absolute right-0 mt-2 w-48 rounded border bg-white text-black shadow-lg z-50">
          {items.length === 0 && (
            <li className="p-2 text-sm text-gray-500">No recent terms</li>
          )}
          {items.map(({ term, url }) => (
            <li key={url}>
              <button
                type="button"
                onClick={(e) => handleOpen(url, e.shiftKey)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleOpen(url, e.shiftKey);
                  }
                }}
                className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-gray-100 focus:bg-gray-100"
              >
                <img src={faviconSrc} alt="" className="h-4 w-4" />
                <span>{term}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

