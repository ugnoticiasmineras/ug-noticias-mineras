module.exports = {
  // 👇 CONFIGURACIÓN DE IMÁGENES (MÁXIMO IMPACTO)
  images: {
    // Dominios permitidos para optimización
    domains: [
      'public-api.wordpress.com',  // WordPress API
      'ugnoticiasmineras.com',      // Tu dominio
      'i0.wp.com',                  // WordPress.com CDN
      'i1.wp.com',                  // WordPress.com CDN
      'i2.wp.com',                  // WordPress.com CDN
    ],
    // Caché de 24 horas para imágenes
    minimumCacheTTL: 60 * 60 * 24, // 24 horas
    // Formatos modernos para mejor compresión
    formats: ['image/webp', 'image/avif'],
    // Tamaño máximo de imagen (en bytes)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'public-api.wordpress.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ugnoticiasmineras.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // 👇 COMPRESIÓN GZIP/BROTLI
  compress: true,

  // 👇 CABECERAS PARA CACHÉ (mejora TTFB)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // 👇 OPTIMIZACIÓN DE BUNDLES
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },

  // 👇 MEJORAR PERFORMANCE EN Vercel/Netlify
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
};