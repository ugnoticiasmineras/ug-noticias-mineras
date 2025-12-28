// pages/index.js
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CotizacionesWidget from '../components/CotizacionesWidget';

const SITE_URL = 'https://ugnoticiasmineras.com';
const WORDPRESS_API_URL = 'https://public-api.wordpress.com/wp/v2/sites/xtianaguilar79-hbsty.wordpress.com';

const categories = {
  nacionales: 170094,
  sanjuan: 67720,
  sindicales: 3865306,
  opinion: 352,
  internacionales: 17119
};

const categoryIdToKey = Object.fromEntries(
  Object.entries(categories).map(([key, id]) => [id, key])
);

const cleanText = (text) => {
  if (!text) return text;
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '--')
    .replace(/\s+/g, ' ')
    .trim();
};

const forceHttps = (url) => {
  if (!url) return `${SITE_URL}/logo.png`;
  return url.trim().replace(/^http:/, 'https:');
};

const processPost = (post) => {
  let processedContent = post.content?.rendered || '';
  processedContent = cleanText(processedContent);

  let firstContentImage = null;
  const contentImages = processedContent.match(/<img[^>]+src="([^">]+)"/);
  if (contentImages && contentImages.length > 0) {
    const srcMatch = contentImages[0].match(/src="([^">]+)"/);
    if (srcMatch && srcMatch[1]) {
      firstContentImage = forceHttps(srcMatch[1]);
    }
  }

  let imageUrl = `${SITE_URL}/logo.png`;
  if (post.featured_media && post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    imageUrl = forceHttps(post._embedded['wp:featuredmedia'][0].source_url).trim();
  } else if (firstContentImage) {
    imageUrl = firstContentImage;
  }

  let source = 'Fuente: WordPress';
  const sourceMatch = processedContent.match(/Fuente:\s*([^<]+)/i);
  if (sourceMatch && sourceMatch[1]) {
    source = `Fuente: ${sourceMatch[1].trim()}`;
  }

  const postDate = new Date(post.date);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = postDate.toLocaleDateString('es-ES', options).replace(' de ', ' de ');

  let excerpt = post.excerpt?.rendered || '';
  excerpt = cleanText(excerpt.replace(/<[^>]*>/g, '').trim());
  if (excerpt.length > 150) excerpt = excerpt.substring(0, 150) + '...';
  else if (excerpt.length === 0 && processedContent) {
    const cleanContent = processedContent.replace(/<[^>]*>/g, '').trim();
    excerpt = cleanContent.substring(0, 150) + '...';
  }

  let title = cleanText(post.title?.rendered || 'Sin título');

  const catId = post.categories?.[0];
  let categoryKey = null;
  if (catId && categoryIdToKey[catId]) {
    categoryKey = categoryIdToKey[catId];
  }

  return {
    id: post.slug,
    title,
    subtitle: excerpt,
    image: imageUrl,
    categoryKey,
    categoryColor: categoryKey === 'nacionales' ? 'bg-blue-600' : 
                  categoryKey === 'sanjuan' ? 'bg-red-500' : 
                  categoryKey === 'sindicales' ? 'bg-green-600' : 
                  categoryKey === 'internacionales' ? 'bg-yellow-600' : 'bg-purple-600',
    source,
    date: formattedDate,
    originalDate: post.date,
    content: processedContent
  };
};

const getCategoryName = (categoryKey) => {
  switch(categoryKey) {
    case 'nacionales': return 'Noticias Nacionales';
    case 'sanjuan': return 'Noticias de San Juan';
    case 'sindicales': return 'Noticias Sindicales';
    case 'internacionales': return 'Noticias Internacionales';
    case 'opinion': return 'Columna de Opinión';
    default: return 'Noticia';
  }
};

const getCategoryLabel = (categoryKey) => {
  switch(categoryKey) {
    case 'nacionales': return 'NACIONAL';
    case 'sanjuan': return 'SAN JUAN';
    case 'sindicales': return 'SINDICAL';
    case 'internacionales': return 'INTERNACIONAL';
    case 'opinion': return 'OPINIÓN';
    default: return 'NOTICIA';
  }
};

const shareOnWhatsApp = (news) => {
  const url = encodeURIComponent(`${SITE_URL}/noticia/${news.categoryKey}/${news.id}`);
  const title = encodeURIComponent(news.title);
  window.open(`https://wa.me/?text=${title}%20${url}`, '_blank');
};

const shareOnFacebook = (news) => {
  const url = encodeURIComponent(`${SITE_URL}/noticia/${news.categoryKey}/${news.id}`);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
};

const shareOnLinkedIn = (news) => {
  const url = encodeURIComponent(`${SITE_URL}/noticia/${news.categoryKey}/${news.id}`);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
};

const renderFeaturedCard = ({ news }) => {
  if (!news.categoryKey) return null;
  
  return (
    <Link key={news.id} href={`/noticia/${news.categoryKey}/${news.id}`} legacyBehavior>
      <a className="block bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-blue-100 dark:border-blue-900 overflow-hidden">
        <div className="h-48 w-full relative">
          <img 
            src={news.image} 
            alt={news.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = `
                <div class="w-full h-full bg-gradient-to-br from-blue-300 to-blue-400 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <div class="text-blue-800 dark:text-blue-200 font-bold text-center p-2">${news.title}</div>
                </div>
              `;
            }}
          />
          <div className={`absolute top-2 left-2 ${news.categoryColor} text-white px-2 py-1 rounded text-xs font-semibold`}>
            {getCategoryLabel(news.categoryKey)}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-blue-900 dark:text-blue-100 text-lg">{news.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 mb-2">{news.subtitle}</p>
          <div className="mt-2 pt-2 border-t border-blue-100 dark:border-blue-900 flex justify-between items-center">
            <p className="text-blue-800 dark:text-blue-200 text-xs font-medium">{news.source}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">{news.date}</p>
          </div>
        </div>
      </a>
    </Link>
  );
};

const renderNewsCard = ({ news, basePath }) => {
  if (!news.categoryKey) return null;
  
  return (
    <Link key={news.id} href={`/noticia/${news.categoryKey}/${news.id}`} legacyBehavior>
      <a className="block bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100 dark:border-blue-900 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 h-48 md:h-full relative">
            <img 
              src={news.image} 
              alt={news.title} 
              className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `
                  <div class="w-full h-full bg-gradient-to-br from-blue-300 to-blue-400 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <div class="text-blue-800 dark:text-blue-200 font-bold text-center p-4">${news.title}</div>
                  </div>
                `;
              }}
            />
            <div className={`absolute top-2 left-2 ${news.categoryColor} text-white px-2 py-1 rounded text-xs font-semibold`}>
              {getCategoryLabel(news.categoryKey)}
            </div>
          </div>
          <div className="md:w-2/3 p-6">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 text-xl">{news.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2 mb-4">{news.subtitle}</p>
            <div className="mt-4 pt-2 border-t border-blue-100 dark:border-blue-900 flex justify-between items-center">
              <p className="text-blue-800 dark:text-blue-200 font-medium">{news.source}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{news.date}</p>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

const renderSidebarCategoryCard = ({ categoryName, categoryKey, latestNews }) => {
  return (
    <div key={categoryKey} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 overflow-hidden mb-4">
      <Link href={categoryKey.startsWith('/') ? categoryKey : `/noticia/${categoryKey}`} legacyBehavior>
        <a className="block">
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-3 text-center">
            <h3 className="text-lg font-bold text-white">{categoryName}</h3>
            <div className="w-16 h-1 bg-red-500 mx-auto mt-1"></div>
          </div>
          <div className="p-2 h-24 bg-white dark:bg-gray-800 flex items-center justify-center">
            {latestNews ? (
              <p className="text-gray-800 dark:text-gray-200 text-center text-sm font-medium px-1">
                {latestNews.title}
              </p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm">Sin noticias</p>
            )}
          </div>
        </a>
      </Link>
    </div>
  );
};

export default function Home({ allNews, sidebarNews, currentDate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNews, setFilteredNews] = useState(allNews);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNews(allNews);
    } else {
      const query = searchQuery.toLowerCase();
      const results = allNews.filter(news => 
        news.title.toLowerCase().includes(query) ||
        news.subtitle.toLowerCase().includes(query) ||
        news.content.toLowerCase().includes(query)
      );
      setFilteredNews(results);
    }
  }, [searchQuery, allNews]);

  const featuredNews = filteredNews.slice(0, 4);
  const otherNews = filteredNews.slice(4);
  const pageSize = 10;
  const startIndex = (page - 1) * pageSize;
  const paginatedNews = otherNews.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(otherNews.length / pageSize);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    if (totalPages <= 1) return [];
    const pages = [];
    if (page > 1) pages.push(page - 1);
    pages.push(page);
    if (page < totalPages) pages.push(page + 1);
    return pages;
  };

  return (
    <Layout currentDate={currentDate}>
      <Head>
        <title>UG Noticias Mineras | Noticias del sector minero argentino</title>
        <meta name="description" content="UG Noticias Mineras: fuente independiente y actualizada sobre minería en Argentina. Proyectos en San Juan, Catamarca, RIGI, litio, cobre y análisis técnico del sector minero." />
        <meta property="og:title" content="UG Noticias Mineras | Noticias del sector minero argentino" />
        <meta property="og:description" content="UG Noticias Mineras: fuente independiente y actualizada sobre minería en Argentina. Proyectos en San Juan, Catamarca, RIGI, litio, cobre y análisis técnico del sector minero." />
        <meta property="og:image" content={`${SITE_URL}/logo.png`} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UG Noticias Mineras" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UG Noticias Mineras | Noticias del sector minero argentino" />
        <meta name="twitter:description" content="UG Noticias Mineras: fuente independiente y actualizada sobre minería en Argentina." />
        <meta name="twitter:image" content={`${SITE_URL}/logo.png`} />
        <meta name="twitter:site" content="@ugnoticiasmin" />
        <link rel="canonical" href={SITE_URL} />
      </Head>

      {/* ✅ Slogan debajo del header, arriba del contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg font-medium">
          Información actualizada del sector minero Argentino
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-4">
          {featuredNews.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6">
                <h2 className="text-2xl font-bold text-white">Noticias Destacadas</h2>
                <div className="w-24 h-1 bg-red-500 mt-2"></div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredNews.map(news => news.categoryKey && renderFeaturedCard({ news }))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6">
              <h2 className="text-2xl font-bold text-white">Últimas Noticias</h2>
              <div className="w-24 h-1 bg-red-500 mt-2"></div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {paginatedNews.map(news => news.categoryKey && renderNewsCard({ news, basePath: '' }))}
              </div>
              {totalPages > 1 && (
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 flex justify-center items-center space-x-1 sm:space-x-2 mt-6 overflow-x-auto">
                  <button 
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap ${page === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-colors`}
                  >
                    Anterior
                  </button>
                  
                  {getPageNumbers().map(pageNum => (
                    <button 
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap ${page === pageNum ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700'} transition-colors`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap ${page === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-colors`}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <CotizacionesWidget />

          {/* ✅ ENLACE A "MAPA DE PROYECTOS MINEROS DE SAN JUAN" EN EL SIDEBAR */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 overflow-hidden mb-4">
            <Link href="/proyectos-mineros-san-juan" legacyBehavior>
              <a className="block">
                <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-3 text-center">
                  <h3 className="text-lg font-bold text-white">Proyectos Mineros de San Juan</h3>
                  <div className="w-16 h-1 bg-red-500 mx-auto mt-1"></div>
                </div>
                <div className="p-2 h-24 bg-white dark:bg-gray-800 flex items-center justify-center">
                  <p className="text-gray-800 dark:text-gray-200 text-center text-sm font-medium px-1">
                    Guía técnica de proyectos
                  </p>
                </div>
              </a>
            </Link>
          </div>

          {Object.entries(categories).map(([key, _]) => (
            <div key={key} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 overflow-hidden mb-4">
              <Link href={`/noticia/${key}`} legacyBehavior>
                <a className="block">
                  <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-3 text-center">
                    <h3 className="text-lg font-bold text-white">{getCategoryName(key)}</h3>
                    <div className="w-16 h-1 bg-red-500 mx-auto mt-1"></div>
                  </div>
                  <div className="p-2 h-24 bg-white dark:bg-gray-800 flex items-center justify-center">
                    {sidebarNews[key] ? (
                      <p className="text-gray-800 dark:text-gray-200 text-center text-sm font-medium px-1">
                        {sidebarNews[key].title}
                      </p>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center text-sm">Sin noticias</p>
                    )}
                  </div>
                </a>
              </Link>
            </div>
          ))}

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 overflow-hidden">
            <div className="p-3 space-y-3">
              {[...Array(5)].map((_, i) => (
                <img 
                  key={i}
                  src="/sponsors/aoma1.jpg" 
                  alt="Colaborador"
                  className="w-full h-16 object-contain rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?per_page=100&orderby=date&order=desc&_embed`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; UGNoticiasMineras/1.0; +https://ugnoticiasmineras.com)',
          'Accept': 'application/json'
        }
      }
    );

    let allNews = [];
    if (response.ok) {
      const posts = await response.json();
      allNews = posts
        .filter(post => post.categories && post.categories.length > 0 && categoryIdToKey[post.categories[0]])
        .map(processPost);
    }

    const sidebarNews = {};
    for (const [key, id] of Object.entries(categories)) {
      try {
        const res = await fetch(
          `${WORDPRESS_API_URL}/posts?categories=${id}&per_page=1&orderby=date&order=desc&_embed`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; UGNoticiasMineras/1.0; +https://ugnoticiasmineras.com)',
              'Accept': 'application/json'
            }
          }
        );
        if (res.ok) {
          const posts = await res.json();
          if (posts.length > 0) {
            sidebarNews[key] = { title: cleanText(posts[0].title?.rendered || 'Sin título') };
          }
        }
      } catch (e) {
        // Silently fail
      }
    }

    return {
      props: {
        allNews,
        sidebarNews,
        currentDate: new Date().toISOString()
      }
    };
  } catch (err) {
    return {
      props: {
        allNews: [],
        sidebarNews: {},
        currentDate: new Date().toISOString()
      }
    };
  }
}