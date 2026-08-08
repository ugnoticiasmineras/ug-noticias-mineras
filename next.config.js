const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // acá van tus configuraciones existentes de next
  // si ya tenías algo como images, reactStrictMode, etc., mantenelo
};

module.exports = withSentryConfig(nextConfig, {
  org: "ug-noticias-mineras",
  project: "ug-noticias-mineras",
  silent: true,
});
