import type { MetadataRoute } from 'next';
import termsData from '../terms.json' assert { type: 'json' };
import siteConfig from '../site.config.json' assert { type: 'json' };

function slugify(term: string): string {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (siteConfig.siteUrl || '').replace(/\/$/, '');

  const termEntries = (termsData.terms || []).map((t: { term: string }) => ({
    url: `${baseUrl}/terms/${slugify(t.term)}`,
    lastModified: new Date(),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    ...termEntries,
  ];
}

