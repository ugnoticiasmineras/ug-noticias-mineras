// pages/en-desarrollo/[id].js
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import CotizacionesWidget from '../../components/CotizacionesWidget';

const SITE_URL = 'https://ugnoticiasmineras.com';
const WORDPRESS_API_URL = 'https://public-api.wordpress.com/wp/v2/sites/xtianaguilar79-hbsty.wordpress.com';
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

const ShareButtons = ({ news }) => (
  <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-blue-100 dark:border-blue-900">
    <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Compartir:</span>
    <button
      onClick={() => shareOnWhatsApp(news)}
      className="flex items-center justify-center w-9 h-9 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
      aria-label="Compartir en WhatsApp"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </button>
    <button
      onClick={() => shareOnFacebook(news)}
      className="flex items-center justify-center w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
      aria-label="Compartir en Facebook"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </button>
    <button
      onClick={() => shareOnLinkedIn(news)}
      className="flex items-center justify-center w-9 h-9 bg-blue-700 hover:bg-blue-800 text-white rounded-full transition-colors"
      aria-label="Compartir en LinkedIn"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    </button>
  </div>
);

export default function NoticiaDetalle({ news, relatedNews, currentDate }) {
  const router = useRouter();

  if (router.isFallback || !news) {
    return (
      <Layout currentDate={currentDate}>
        <Head>
          <meta name="robots" content="noindex, nofollow" />
          <meta name="googlebot" content="noindex, nofollow" />
          <title>Cargando... | UG Noticias Mineras</title>
        </Head>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Cargando noticia...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentDate={currentDate}>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        
        <title>{news.title} | UG Noticias Mineras</title>
        <meta name="description" content={news.subtitle} />
        
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={news.subtitle} />
        <meta property="og:image" content={news.image} />
        <meta property="og:url" content={`${SITE_URL}/en-desarrollo/${news.id}`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="UG Noticias Mineras" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={news.title} />
        <meta name="twitter:description" content={news.subtitle} />
        <meta name="twitter:image" content={news.image} />
        <meta name="twitter:site" content="@ugnoticiasmin" />
        
        <link rel="canonical" href={`${SITE_URL}/en-desarrollo/${news.id}`} />
      </Head>

      <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 overflow-hidden">
        {/* Header con imagen */}
        <div className="relative h-64 md:h-80 lg:h-96">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = `
                <div class="w-full h-full bg-gradient-to-br from-blue-300 to-blue-400 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <div class="text-blue-800 dark:text-blue-200 font-bold text-center p-4 text-lg">${news.title}</div>
                </div>
              `;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className={`inline-block ${news.categoryColor} text-white px-3 py-1 rounded text-xs font-semibold mb-2`}>
              {getCategoryLabel(news.categoryKey)}
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">{news.title}</h1>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-6 md:p-8">
          {/* Meta información */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-6 border-b border-blue-100 dark:border-blue-900">
            <time dateTime={news.originalDate}>{news.date}</time>
            <span>•</span>
            <span>{news.source}</span>
          </div>

          {/* Resumen */}
          {news.subtitle && (
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 italic border-l-4 border-blue-500 pl-4">
              {news.subtitle}
            </p>
          )}

          {/* Contenido de la noticia */}
          <div 
            className="prose prose-blue dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {/* Botones de compartir */}
          <ShareButtons news={news} />

          {/* Navegación */}
          <div className="mt-8 pt-6 border-t border-blue-100 dark:border-blue-900">
            <Link href="/en-desarrollo" legacyBehavior>
              <a className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a Noticias en Desarrollo
              </a>
            </Link>
          </div>
        </div>
      </article>

      {/* Noticias relacionadas */}
      {relatedNews && relatedNews.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">Otras noticias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedNews.slice(0, 2).map((related) => (
              <Link key={related.id} href={`/en-desarrollo/${related.id}`} legacyBehavior>
                <a className="block bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-blue-100 dark:border-blue-900 overflow-hidden">
                  <div className="flex">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.className = 'w-24 h-24 flex-shrink-0 bg-gradient-to-br from-blue-300 to-blue-400 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center';
                          e.target.parentNode.innerHTML = `<div class="text-blue-800 dark:text-blue-200 font-bold text-xs text-center p-1">${related.title.substring(0, 30)}...</div>`;
                        }}
                      />
                    </div>
                    <div className="p-3 flex-1">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm line-clamp-2">{related.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{related.date}</p>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}

export async function getStaticPaths() {
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

    let paths = [];
    if (response.ok) {
      const posts = await response.json();
      paths = posts.map(post => ({
        params: { id: post.slug },
      }));
    }

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (err) {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }) {
  const { id } = params;

  try {
    // Obtener la noticia específica por slug
    const postResponse = await fetch(
      `${WORDPRESS_API_URL}/posts?slug=${id}&_embed`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; UGNoticiasMineras/1.0; +https://ugnoticiasmineras.com)',
          'Accept': 'application/json'
        }
      }
    );

    if (!postResponse.ok || postResponse.status === 404) {
      return {
        notFound: true,
      };
    }

    const posts = await postResponse.json();
    if (!posts || posts.length === 0) {
      return {
        notFound: true,
      };
    }

    const news = processPost(posts[0]);

    // Obtener noticias relacionadas para la sección inferior
    let relatedNews = [];
    try {
      const relatedResponse = await fetch(
        `${WORDPRESS_API_URL}/posts?categories=${UNCATEGORIZED_ID}&per_page=5&orderby=date&order=desc&_embed`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; UGNoticiasMineras/1.0; +https://ugnoticiasmineras.com)',
            'Accept': 'application/json'
          }
        }
      );
      if (relatedResponse.ok) {
        const relatedPosts = await relatedResponse.json();
        relatedNews = relatedPosts
          .filter(post => post.slug !== id)
          .map(processPost)
          .slice(0, 4);
      }
    } catch (e) {
      relatedNews = [];
    }

    return {
      props: {
        news,
        relatedNews,
        currentDate: new Date().toISOString()
      },
      revalidate: 60,
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}