// pages/noticia/[cat]/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import CotizacionesWidget from '../../../components/CotizacionesWidget';

const SITE_URL = 'https://ug-noticias-mineras.vercel.app';
const WORDPRESS_API_URL = 'https://public-api.wordpress.com/wp/v2/sites/xtianaguilar79-hbsty.wordpress.com';

const categories = {
  nacionales: 170094,
  sanjuan: 67720,
  sindicales: 3865306,
  opinion: 352,
  internacionales: 17119
};

const sponsors = [
  { image: '/sponsors/aoma1.jpg', url: 'https://ug-noticias-mineras.vercel.app' },
  { image: '/sponsors/aoma1.jpg', url: 'https://ug-noticias-mineras.vercel.app' },
  { image: '/sponsors/aoma1.jpg', url: 'https://ug-noticias-mineras.vercel.app' },
  { image: '/sponsors/aoma1.jpg', url: 'https://ug-noticias-mineras.vercel.app' },
  { image: '/sponsors/aoma1.jpg', url: 'https://ug-noticias-mineras.vercel.app' },
];

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
  return url.replace(/^http:/, 'https:');
};

const processPost = (post, categoryKey) => {
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
    imageUrl = forceHttps(post._embedded['wp:featuredmedia'][0].source_url);
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
    categoryKey,
    categoryColor: categoryKey === 'nacionales' ? 'bg-blue-600' : 
                  categoryKey === 'sanjuan' ? 'bg-red-500' : 
                  categoryKey === 'sindicales' ? 'bg-green-600' : 
                  categoryKey === 'internacionales' ? 'bg-yellow-600' : 'bg-purple-600',
    content: processedContent,
    source,
    date: formattedDate,
    originalDate: post.date
  };
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

// ✅ Componente para renderizar contenido con imágenes clickeables que abren lightbox
const ContentWithLightbox = ({ htmlContent, onImageClick }) => {
  // Usamos un div temporal para manipular el DOM del contenido
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  const images = tempDiv.querySelectorAll('img');
  images.forEach(img => {
    const src = img.src;
    if (!src) return;

    // Removemos posibles enlaces que envuelvan la imagen
    if (img.parentElement.tagName === 'A') {
      img.parentElement.replaceWith(img);
    }

    // Creamos un contenedor clickeable
    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline-block';
    wrapper.style.cursor = 'zoom-in';
    wrapper.style.margin = '0.5rem 0';
    wrapper.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onImageClick(src);
    };

    // Remplazamos la imagen por el contenedor con la imagen adentro
    img.parentNode.replaceChild(wrapper, img);
    wrapper.appendChild(img);
  });

  return tempDiv.innerHTML;
};

export default function NoticiaPage({ noticia, sidebarNews, currentDate }) {
  const router = useRouter();
  const { cat, id } = router.query;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');

  if (!noticia) {
    return (
      <Layout currentDate={currentDate}>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center max-w-2xl mx-auto mt-12">
          <h3 className="text-yellow-800 font-bold text-xl mb-2">Noticia no encontrada</h3>
          <p className="text-yellow-700 mb-6">La noticia que buscas no está disponible.</p>
        </div>
      </Layout>
    );
  }

  // Procesamos el contenido para añadir eventos de lightbox a las imágenes
  const [processedContent, setProcessedContent] = useState('');
  useEffect(() => {
    try {
      const safeHtml = ContentWithLightbox({
        htmlContent: noticia.content,
        onImageClick: openLightbox
      });
      setProcessedContent(safeHtml);
    } catch (e) {
      // Si falla, usamos el contenido original sin manipular
      setProcessedContent(noticia.content);
    }
  }, [noticia.content]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    if (lightboxOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [lightboxOpen]);

  const openLightbox = (imgSrc) => {
    setLightboxImage(imgSrc);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const shareOnWhatsApp = () => {
    const url = encodeURIComponent(`${SITE_URL}/noticia/${cat}/${id}`);
    const title = encodeURIComponent(noticia.title);
    window.open(`https://wa.me/?text=${title}%20${url}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(`${SITE_URL}/noticia/${cat}/${id}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(`${SITE_URL}/noticia/${cat}/${id}`);
    const title = encodeURIComponent(noticia.title);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank', 'width=600,height=400');
  };

  return (
    <>
      <Head>
        <title>{noticia.title} - UG Noticias Mineras</title>
        <meta name="description" content={noticia.subtitle} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${SITE_URL}/noticia/${cat}/${id}`} />
        <meta property="og:title" content={noticia.title} />
        <meta property="og:description" content={noticia.subtitle} />
        <meta property="og:image" content={noticia.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="UG Noticias Mineras" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={noticia.title} />
        <meta name="twitter:description" content={noticia.subtitle} />
        <meta name="twitter:image" content={noticia.image} />
        <meta name="twitter:site" content="@ugnoticiasmin" />
      </Head>

      <Layout currentDate={currentDate}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {getCategoryName(noticia.categoryKey)}
                </h2>
                <div className="w-24 h-1 bg-red-500 mt-2"></div>
              </div>
              <div className="p-6">
                <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg border border-blue-200 dark:border-blue-900 overflow-hidden">
                  {noticia.image && (
                    <div 
                      className="h-80 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center relative overflow-hidden cursor-pointer"
                      onClick={() => openLightbox(noticia.image)}
                    >
                      <img 
                        src={noticia.image} 
                        alt={noticia.title} 
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-br from-blue-300 to-blue-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                              <div class="text-blue-800 dark:text-blue-200 font-bold text-center p-4">${noticia.title}</div>
                            </div>
                          `;
                        }}
                      />
                      <div className={`absolute top-4 left-4 ${noticia.categoryColor} text-white px-3 py-1 rounded-full font-semibold text-sm`}>
                        {getCategoryLabel(noticia.categoryKey)}
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-bold text-2xl text-blue-900 dark:text-blue-100 mb-4">{noticia.title}</h3>
                    {noticia.subtitle && <p className="text-blue-700 dark:text-blue-300 font-medium mb-4">{noticia.subtitle}</p>}
                    
                    {/* ✅ Contenido con imágenes que abren lightbox */}
                    <div 
                      className="content-html text-gray-700 dark:text-gray-300 leading-relaxed max-w-none prose"
                      dangerouslySetInnerHTML={{ __html: processedContent }}
                    />

                    <div className="mt-6 pt-4 border-t border-blue-100 dark:border-blue-900">
                      <p className="text-blue-800 dark:text-blue-200 font-medium">{noticia.source}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Publicado: {noticia.date}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-blue-200 dark:border-blue-900 flex justify-center space-x-4">
                      <button 
                        onClick={shareOnWhatsApp}
                        className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-colors shadow-md"
                        title="Compartir en WhatsApp"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.P157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </button>
                      <button 
                        onClick={shareOnFacebook}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors shadow-md"
                        title="Compartir en Facebook"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </button>
                      <button 
                        onClick={shareOnLinkedIn}
                        className="bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-full transition-colors shadow-md"
                        title="Compartir en LinkedIn"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 hidden lg:block">
            <CotizacionesWidget />
            
            {Object.entries(categories).map(([key, _]) => {
              if (key === cat) return null;
              return (
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
                          <p className="text-gray-500 dark:text-gray-400 text-center text-sm">Sin noticias aún</p>
                        )}
                      </div>
                    </a>
                  </Link>
                </div>
              );
            })}
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 overflow-hidden mt-4">
              <div className="p-3 space-y-3">
                {sponsors.map((sponsor, i) => (
                  <Link key={i} href={sponsor.url} legacyBehavior>
                    <a target="_blank" rel="noopener noreferrer">
                      <img 
                        src={sponsor.image} 
                        alt={`Colaborador ${i + 1}`}
                        className="w-full h-16 object-contain rounded-lg"
                      />
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Lightbox para imágenes del contenido */}
        {lightboxOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <button 
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 z-10"
                onClick={closeLightbox}
                aria-label="Cerrar"
              >
                ✕
              </button>
              <img 
                src={lightboxImage} 
                alt="Imagen ampliada"
                className="max-h-[90vh] max-w-full object-contain"
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
              />
            </div>
          </div>
        )}
      </Layout>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { cat, id } = params;
  const categoryId = categories[cat];

  if (!categoryId) {
    return { notFound: true };
  }

  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?slug=${id}&_embed`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; UGNoticiasMineras/1.0; +https://ug-noticias-mineras.vercel.app)',
          'Accept': 'application/json'
        }
      }
    );
    if (!response.ok) return { notFound: true };
    const posts = await response.json();
    if (posts.length === 0) return { notFound: true };
    const noticia = processPost(posts[0], cat);

    const sidebarNews = {};
    for (const [key, catId] of Object.entries(categories)) {
      if (key === cat) continue;
      try {
        const res = await fetch(
          `${WORDPRESS_API_URL}/posts?categories=${catId}&per_page=1&orderby=date&order=desc&_embed`,
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
            sidebarNews[key] = processPostForSidebar(posts[0], key);
          }
        }
      } catch (e) {
        // Silently fail
      }
    }

    return {
      props: {
        noticia,
        sidebarNews,
        currentDate: new Date().toISOString()
      }
    };
  } catch (err) {
    return { notFound: true };
  }
}