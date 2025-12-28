// pages/api/sitemap.xml.js
const WORDPRESS_API_URL = 'https://public-api.wordpress.com/wp/v2/sites/xtianaguilar79-hbsty.wordpress.com';

const categories = {
  nacionales: 170094,
  sanjuan: 67720,
  sindicales: 3865306,
  opinion: 352,
  internacionales: 17119
};

// Mapeo inverso: ID de categoría → clave
const categoryIdToKey = {
  '170094': 'nacionales',
  '67720': 'sanjuan',
  '3865306': 'sindicales',
  '352': 'opinion',
  '17119': 'internacionales'
};

export default async function handler(req, res) {
  try {
    // Obtener hasta 1000 posts (máximo permitido por WordPress.com)
    const postsRes = await fetch(
      `${WORDPRESS_API_URL}/posts?per_page=1000&orderby=date&order=desc&_fields=slug,date,modified,categories`
    );

    if (!postsRes.ok) {
      console.error('Error fetching posts:', postsRes.status);
      throw new Error('Failed to fetch posts');
    }

    const posts = await postsRes.json();

    // Generar URLs de noticias
    const newsUrls = posts
      .filter(post => post.categories && post.categories.length > 0)
      .map(post => {
        const catId = post.categories[0].toString();
        const catKey = categoryIdToKey[catId] || 'nacionales';
        const lastmod = new Date(post.modified).toISOString().split('T')[0];
        return `  <url>
    <loc>https://ugnoticiasmineras.com/noticia/${catKey}/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .join('\n');

    // Generar URLs de categorías
    const categoryUrls = Object.keys(categories)
      .map(cat => 
        `  <url>
    <loc>https://ugnoticiasmineras.com/noticia/${cat}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
      )
      .join('\n');

    // Construir sitemap completo
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>https://ugnoticiasmineras.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${categoryUrls}
${newsUrls}
</urlset>`;

    // Enviar respuesta XML
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); // Cachear 1 día
    res.status(200).send(sitemap);
  } catch (err) {
    console.error('Error generating sitemap:', err);
    res.status(500).send('Error generating sitemap');
  }
}