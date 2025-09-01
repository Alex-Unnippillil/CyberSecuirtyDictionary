const { withContentlayer } = require('next-contentlayer')

const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.yaml': ['contentlayer'],
        '*.yml': ['contentlayer'],
      },
    },
  },
}

module.exports = withContentlayer(nextConfig)
