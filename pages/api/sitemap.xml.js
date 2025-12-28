// pages/api/sitemap.xml.js
export default function handler(req, res) {
  const baseUrl = 'https://ugnoticiasmineras.com';
  const staticPaths = [
    '',
    'noticia/nacionales',
    'noticia/sanjuan',
    'noticia/sindicales',
    'noticia/opinion',
    'noticia/internacionales'
  ];

  const urls = staticPaths.map(path => {
    const fullUrl = path ? `${baseUrl}/${path}` : baseUrl;
    return `  <url>
    <loc>${fullUrl}</loc>
    <changefreq>${path ? 'weekly' : 'daily'}</changefreq>
    <priority>${path ? '0.8' : '1.0'}</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.status(200).send(sitemap);
}