module.exports = {
  // 👇 CONFIGURACIÓN DE IMÁGENES (MÁXIMO IMPACTO)
  images: {
    domains: [
      'public-api.wordpress.com',
      'ugnoticiasmineras.com',
      'i0.wp.com',
      'i1.wp.com',
      'i2.wp.com',
    ],
    minimumCacheTTL: 60 * 60 * 24, // 24 horas
    formats: ['image/webp', 'image/avif'],
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

  // 👇 CABECERAS PARA CACHÉ
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

  // 👇 MEJORAR PERFORMANCE
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
};