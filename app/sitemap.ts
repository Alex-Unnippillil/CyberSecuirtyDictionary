import type { MetadataRoute } from 'next';
import termsData from '../terms.json';
import siteConfig from '../site.config.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl: string = siteConfig.siteUrl;

  const termUrls = (termsData.terms || []).map((item: { term: string }) => ({
    url: `${baseUrl}#${encodeURIComponent(item.term)}`,
    lastModified: new Date().toISOString(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
    },
    ...termUrls,
  ];
}
