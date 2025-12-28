// pages/api/sitemap.xml.js
export default function handler(req, res) {
  const baseUrl = 'https://ugnoticiasmineras.com';
  const paths = [
    '',
    'noticia/nacionales',
    'noticia/sanjuan',
    'noticia/sindicales',
    'noticia/opinion',
    'noticia/internacionales'
  ];

  const urls = paths.map(path => {
    const fullUrl = path ? `${baseUrl}/${path}` : baseUrl;
    const changeFreq = path ? 'weekly' : 'daily';
    const priority = path ? '0.8' : '1.0';
    return `  <url>
    <loc>${fullUrl}</loc>
    <changefreq>${changeFreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.status(200).send(sitemap);
}