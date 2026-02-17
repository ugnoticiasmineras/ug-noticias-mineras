/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/feed',
        destination: 'https://xtianaguilar79-hbsty.wordpress.com/feed/',
      },
    ];
  },
};

module.exports = nextConfig;
