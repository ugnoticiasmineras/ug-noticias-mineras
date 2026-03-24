// pages/en-desarrollo.js
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CotizacionesWidget from '../components/CotizacionesWidget';

const SITE_URL = 'https://ugnoticiasmineras.com';
const WORDPRESS_API_URL = 'https://public-api.wordpress.com/wp/v2/sites/xtianaguilar79-hbsty.wordpress.com';

// ID de la categoría "uncategorized" en WordPress (por defecto es 1)
const UNCATEGORIZED_ID = 1;

const cleanText = (text) => {
  if (!text) return text;
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
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
  if (!url) return `${SITE_URL}/UGNoticias.png`;
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

  let imageUrl = `${SITE_URL}/UGNoticias.png`;
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

  return {
    id: post.slug,
    title,
    subtitle: excerpt,
    image: imageUrl,
    categoryKey: 'uncategorized',
    categoryColor: 'bg-gray-500',
    source,
    date: formattedDate,
    originalDate: post.date,
    content: processedContent
  };
};

const getCategoryName = (categoryKey) => {
  if (categoryKey === 'uncategorized') return 'Noticias en Desarrollo';
  return 'Noticia';
};

const getCategoryLabel = (categoryKey) => {
  if (categoryKey === 'uncategorized') return 'EN DESARROLLO';
  return 'NOTICIA';
};

const shareOnWhatsApp = (news) => {
  const url = encodeURIComponent(`${SITE_URL}/en-desarrollo/${news.id}`);
  const title = encodeURIComponent(news.title);
  window.open(`https://wa.me/?text=${title}%20${url}`, '_blank');
};

const shareOnFacebook = (news) => {
  const url = encodeURIComponent(`${SITE_URL}/en-desarrollo/${news.id}`);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
};

const shareOnLinkedIn = (news) => {
  const url = encodeURIComponent(`${SITE_URL}/en-desarrollo/${news.id}`);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
};

const renderFeaturedCard = ({ news }) => {
  return (
    <Link key={news.id} href={`/en-desarrollo/${news.id}`} legacyBehavior>
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

const renderNewsCard = ({ news }) => {
  return (
    <Link key={news.id} href={`/en-desarrollo/${news.id}`} legacyBehavior>
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

export default function EnDesarrollo({ allNews, currentDate }) {
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
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Layout currentDate={currentDate}>
      <Head>
        {/* 👇 META TAGS PARA EVITAR INDEXACIÓN EN GOOGLE Y OTROS BUSCADORES */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        
        <title>UG Noticias Mineras | Noticias en Desarrollo</title>
        <meta name="description" content="Noticias en desarrollo y revisión de UG Noticias Mineras - Sector minero argentino" />
        <meta property="og:title" content="UG Noticias Mineras - En Desarrollo" />
        <meta property="og:description" content="Noticias en desarrollo del sector minero argentino" />
        <meta property="og:image" content={`${SITE_URL}/UGNoticias.png`} />
        <meta property="og:url" content={`${SITE_URL}/en-desarrollo`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UG Noticias Mineras" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UG Noticias Mineras - En Desarrollo" />
        <meta name="twitter:description" content="Noticias en desarrollo del sector minero argentino" />
        <meta name="twitter:image" content={`${SITE_URL}/UGNoticias.png`} />
        <meta name="twitter:site" content="@ugnoticiasmin" />
        <link rel="canonical" href={`${SITE_URL}/en-desarrollo`} />
      </Head>

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
                  {featuredNews.map(news => renderFeaturedCard({ news }))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6">
              <h2 className="text-2xl font-bold text-white">Noticias en Desarrollo</h2>
              <div className="w-24 h-1 bg-red-500 mt-2"></div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {paginatedNews.map(news => renderNewsCard({ news }))}
              </div>
              {totalPages > 1 && (
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 flex justify-center items-center space-x-2 mt-6 flex-wrap">
                  <button 
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      page === 1 
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                        : 'text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Anterior
                  </button>

                  <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium">
                    {page}
                  </span>

                  <button 
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      page === totalPages 
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                        : 'text-blue-600 hover:bg-blue-100 dark:hover:bg-gray-700'
                    }`}
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

export async function getStaticProps() {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?categories=${UNCATEGORIZED_ID}&per_page=100&orderby=date&order=desc&_embed`,
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
      allNews = posts.map(processPost);
    }

    return {
      props: {
        allNews,
        currentDate: new Date().toISOString()
      },
      revalidate: 60
    };
  } catch (err) {
    return {
      props: {
        allNews: [],
        currentDate: new Date().toISOString()
      },
      revalidate: 60
    };
  }
}