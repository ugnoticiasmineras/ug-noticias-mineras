// pages/index.js
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import CotizacionesWidget from '../components/CotizacionesWidget';

const WORDPRESS_API_URL = 'https://public-api.wordpress.com/wp/v2/sites/xtianaguilar79-hbsty.wordpress.com';
const categories = {
  nacionales: 170094,
  sanjuan: 67720,
  sindicales: 3865306,
  opinion: 352,
  internacionales: 17119
};

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
  if (!url) return '/logo.png';
  return url.replace(/^http:/, 'https:');
};

const processPostForSidebar = (post, categoryKey) => {
  let title = cleanText(post.title?.rendered || 'Sin título');
  return {
    id: post.slug,
    title,
    categoryKey
  };
};

const getCategoryName = (categoryKey) => {
  switch(categoryKey) {
    case 'nacionales': return 'Nacionales';
    case 'sanjuan': return 'San Juan';
    case 'sindicales': return 'Sindicales';
    case 'internacionales': return 'Internacionales';
    case 'opinion': return 'Opinión';
    default: return 'Noticia';
  }
};

export default function Home({ latestNews, currentDate }) {
  return (
    <Layout currentDate={currentDate}>
      <Head>
        <title>UG Noticias Mineras</title>
        <meta name="description" content="Noticias mineras de Argentina y el mundo." />
        <meta property="og:title" content="UG Noticias Mineras" />
        <meta property="og:description" content="Noticias mineras de Argentina y el mundo." />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content="https://ug-noticias-mineras.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6">
              <h2 className="text-2xl font-bold text-white">Últimas Noticias</h2>
              <div className="w-24 h-1 bg-red-500 mt-2"></div>
            </div>
            <div className="p-6">
              {/* Aquí iría la lista de últimas noticias */}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          {/* ✅ WIDGET EN LA PARTE SUPERIOR DEL SIDEBAR */}
          <CotizacionesWidget />
          
          {Object.entries(categories).map(([key, _]) => (
            <div key={key} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 overflow-hidden mb-4">
              <Link href={`/noticia/${key}`} legacyBehavior>
                <a className="block">
                  <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-3 text-center">
                    <h3 className="text-lg font-bold text-white">{getCategoryName(key)}</h3>
                    <div className="w-16 h-1 bg-red-500 mx-auto mt-1"></div>
                  </div>
                  <div className="p-2 h-24 bg-white dark:bg-gray-800 flex items-center justify-center">
                    {latestNews[key] ? (
                      <p className="text-gray-800 dark:text-gray-200 text-center text-sm font-medium px-1">
                        {latestNews[key].title}
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
  const latestNews = {};

  for (const [key, id] of Object.entries(categories)) {
    try {
      const res = await fetch(
        `${WORDPRESS_API_URL}/posts?categories=${id}&per_page=1&orderby=date&order=desc&_embed`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; UGNoticiasMineras/1.0; +https://ug-noticias-mineras.vercel.app)',
            'Accept': 'application/json'
          }
        }
      );
      if (res.ok) {
        const posts = await res.json();
        if (posts.length > 0) {
          latestNews[key] = processPostForSidebar(posts[0], key);
        }
      }
    } catch (e) {
      // Silently fail
    }
  }

  return {
    props: {
      latestNews,
      currentDate: new Date().toISOString()
    }
  };
}