const { withSentryConfig } = require("@sentry/nextjs");

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

module.exports = withSentryConfig(nextConfig, {
  org: "ug-noticias-mineras",
  project: "ug-noticias-mineras",
  silent: true,
});
