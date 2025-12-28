// pages/api/sitemap.xml.js
const WORDPRESS_API_URL = 'https://public-api.wordpress.com/wp/v2/sites/xtianaguilar79-hbsty.wordpress.com';

const categories = {
  nacionales: 170094,
  sanjuan: 67720,
  sindicales: 3865306,
  opinion: 352,
  internacionales: 17119
};

const categoryIdToKey = {
  '170094': 'nacionales',
  '67720': 'sanjuan',
  '3865306': 'sindicales',
  '352': 'opinion',
  '17119': 'internacionales'
};

function formatDate(dateString) {
  if (!dateString) return '2025-01-01';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

export default async function handler(req, res) {
  try {
    // WordPress.com permite máximo 100 posts por petición. Usamos 100 para mayor estabilidad.
    const perPage = 100;
    let allPosts = [];
    let page = 1;
    let hasMore = true;

    // Obtener posts en lotes (hasta 500)
    while (hasMore && allPosts.length < 500) {
      const url = `${WORDPRESS_API_URL}/posts?per_page=${perPage}&page=${page}&orderby=date&order=desc&_fields=slug,date,modified,categories`;
      const response = await fetch(url, {
        next: { revalidate: 3600 } // cache de 1 hora
      });

      if (!response.ok) {
        console.warn(`Error al cargar página ${page}:`, response.status);
        break;
      }

      const posts = await response.json();
      if (!Array.isArray(posts) || posts.length === 0) {
        hasMore = false;
        break;
      }

      allPosts = [...allPosts, ...posts];
      page++;

      // Si recibimos menos de `perPage`, es la última página
      if (posts.length < perPage) hasMore = false;
    }

    // Filtrar posts válidos con slug y categoría reconocida
    const validPosts = allShares.filter(post => {
      if (!post.slug || !post.categories || !Array.isArray(post.categories)) return false;
      const catId = post.categories[0]?.toString();
      return categoryIdToKey[catId] !== undefined;
    });

    // Generar URLs de noticias
    const newsUrls = validPosts.map(post => {
      const catId = post.categories[0].toString();
      const catKey = categoryIdToKey[catId];
      const lastmod = formatDate(post.modified || post.date);
      return `  <url>
    <loc>https://ugnoticiasmineras.com/noticia/${catKey}/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join('\n');

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

    // Sitemap completo
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ugnoticiasmineras.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${categoryUrls}
${newsUrls}
</urlset>`;

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.status(200).send(sitemap);
  } catch (err) {
    console.error('Error detallado en sitemap:', err.message || err);
    // Si falla, devolvemos un sitemap mínimo (solo inicio y categorías)
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ugnoticiasmineras.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${Object.keys(categories).map(cat => 
  `  <url>
    <loc>https://ugnoticiasmineras.com/noticia/${cat}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.status(200).send(fallbackSitemap);
  }
}