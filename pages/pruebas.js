// pages/pruebas.js
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import CotizacionesWidget from '../components/CotizacionesWidget';

const SITE_URL = 'https://ugnoticiasmineras.com';
const WORDPRESS_API_URL = 'https://public-api.wordpress.com/wp/v2/sites/xtianaguilar79-hbsty.wordpress.com';
const UNCATEGORIZED_ID = 1; // ← Cambia si tu ID es diferente

const cleanText = (text) => {
  if (!text) return text;
  return text
    .replace(/ /g, ' ')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
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
    imageUrl = firstContentImage;  }

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

const renderNewsCard = ({ news }) => {
  return (
    <Link key={news.id} href={`/noticia/uncategorized/${news.id}`} legacyBehavior>
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
                  <div class="w-full h-full bg-gradient-to-br from-blue-300 to-blue-400 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">                    <div class="text-blue-800 dark:text-blue-200 font-bold text-center p-4">${news.title}</div>
                  </div>
                `;
              }}
            />
            <div className={`absolute top-2 left-2 ${news.categoryColor} text-white px-2 py-1 rounded text-xs font-semibold`}>
              SIN CATEGORÍA
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

export default function PruebasPage({ newsList, currentDate }) {
  if (!newsList || newsList.length === 0) {
    return (
      <Layout currentDate={currentDate}>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center max-w-2xl mx-auto mt-12">
          <h3 className="text-yellow-800 font-bold text-xl mb-2">No hay noticias de prueba</h3>
          <p className="text-yellow-700 mb-6">Esta página está reservada para pruebas internas.</p>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Pruebas Internas – UG Noticias Mineras</title>
        <meta name="description" content="Página de pruebas internas. No indexada." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${SITE_URL}/pruebas`} />
      </Head>

      <Layout currentDate={currentDate}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6">
                <h2 className="text-2xl font-bold text-white">Noticias de Prueba</h2>                <div className="w-24 h-1 bg-red-500 mt-2"></div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {newsList.map(news => renderNewsCard({ news }))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <CotizacionesWidget />
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 overflow-hidden mt-4">
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
    </>
  );
}

export async function getServerSideProps() {
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

    let newsList = [];
    if (response.ok) {
      const posts = await response.json();
      newsList = posts.map(processPost);
    }

    return {      props: {
        newsList,
        currentDate: new Date().toISOString()
      }
    };
  } catch (err) {
    return {
      props: {
        newsList: [],
        currentDate: new Date().toISOString()
      }
    };
  }
                }
