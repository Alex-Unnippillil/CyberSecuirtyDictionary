import termsData from '../../terms.json';
import siteConfig from '../../site.config.json';

export async function GET() {
  const baseUrl: string = siteConfig.siteUrl;
  const imagesXml = (termsData.terms || [])
    .filter((item: { term: string; image?: string }) => Boolean(item.image))
    .map((item: { term: string; image: string }) => {
      const loc = `${baseUrl}#${encodeURIComponent(item.term)}`;
      const imgUrl = item.image.startsWith('http') ? item.image : `${baseUrl}${item.image}`;
      return [
        '\n  <url>',
        `\n    <loc>${loc}</loc>`,
        '\n    <image:image>',
        `\n      <image:loc>${imgUrl}</image:loc>`,
        `\n      <image:title>${item.term}</image:title>`,
        '\n    </image:image>',
        '\n  </url>',
      ].join('');
    })
    .join('');

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' +
    imagesXml +
    '\n</urlset>';

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
