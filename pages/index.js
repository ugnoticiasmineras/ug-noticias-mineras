import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
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
  if (!text) return '';
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
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
  return url.replace(/^http:/, 'https:');
};

const processPost = (post) => {
  const content = post.content?.rendered || '';
  const cleanedContent = cleanText(content.replace(/<[^>]*>/g, ''));

  let imageUrl = `${SITE_URL}/UGNoticias.png`;
  if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    imageUrl = forceHttps(post._embedded['wp:featuredmedia'][0].source_url);
  }

  const title = cleanText(post.title?.rendered || 'Sin título');
  let excerpt = cleanText(post.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '');
  if (!excerpt) excerpt = cleanedContent.slice(0, 150) + '…';
  if (excerpt.length > 150) excerpt = excerpt.slice(0, 150) + '…';

  const categoryId = post.categories?.[0];
  const categoryKey = categoryIdToKey[categoryId] || null;

  return {
    id: post.slug,
    title,
    subtitle: excerpt,
    image: imageUrl,
    categoryKey,
    categoryColor:
      categoryKey === 'nacionales' ? 'bg-blue-600' :
      categoryKey === 'sanjuan' ? 'bg-red-500' :
      categoryKey === 'sindicales' ? 'bg-green-600' :
      categoryKey === 'internacionales' ? 'bg-yellow-600' :
      'bg-purple-600',
    date: new Date(post.date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    searchText: `${title} ${excerpt}`.toLowerCase()
  };
};

const getCategoryLabel = (key) => ({
  nacionales: 'NACIONAL',
  sanjuan: 'SAN JUAN',
  sindicales: 'SINDICAL',
  internacionales: 'INTERNACIONAL',
  opinion: 'OPINIÓN'
}[key] || 'NOTICIA');

const renderFeaturedCard = (news) => (
  <Link href={`/noticia/${news.categoryKey}/${news.id}`} key={news.id}>
    <a className="block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image
          src={news.image}
          alt={news.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <div className={`absolute top-2 left-2 ${news.categoryColor} text-white px-2 py-1 text-xs rounded`}>
          {getCategoryLabel(news.categoryKey)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{news.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{news.subtitle}</p>
      </div>
    </a>
  </Link>
);

const renderNewsCard = (news) => (
  <Link href={`/noticia/${news.categoryKey}/${news.id}`} key={news.id}>
    <a className="block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-1/3 h-48">
          <Image
            src={news.image}
            alt={news.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="p-4 md:w-2/3">
          <h3 className="font-bold text-lg">{news.title}</h3>
          <p className="text-sm text-gray-600 mt-2">{news.subtitle}</p>
        </div>
      </div>
    </a>
  </Link>
);

export default function Home({ allNews }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = search
    ? allNews.filter(n => n.searchText.includes(search.toLowerCase()))
    : allNews;

  const featured = filtered.slice(0, 4);
  const rest = filtered.slice(4);
  const pageSize = 10;
  const paginated = rest.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Layout>
      <Head>
        <title>UG Noticias Mineras</title>
        <meta name="description" content="Noticias mineras de Argentina" />
        <link rel="canonical" href={SITE_URL} />
      </Head>

      <main className="grid lg:grid-cols-5 gap-6">
        <section className="lg:col-span-4 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {featured.map(renderFeaturedCard)}
          </div>

          <div className="space-y-6">
            {paginated.map(renderNewsCard)}
          </div>
        </section>

        <aside className="space-y-4">
          <CotizacionesWidget />
        </aside>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const res = await fetch(
    `${WORDPRESS_API_URL}/posts?per_page=30&orderby=date&order=desc&_embed`
  );
  const posts = res.ok ? await res.json() : [];

  return {
    props: {
      allNews: posts
        .filter(p => categoryIdToKey[p.categories?.[0]])
        .map(processPost)
    },
    revalidate: 60
  };
}
