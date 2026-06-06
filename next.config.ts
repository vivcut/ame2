/** @type {import('next').NextConfig} */
const nextconfig = {
  experimental: {
    // This tells the bundler to completely ignore the public folder during function tracing
    outputFileTracingExcludes: {
      '*': ['public/**/*'],
    },
  },
};

module.exports = nextconfig;