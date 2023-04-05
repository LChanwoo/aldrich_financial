/** @type {import('next').NextConfig} */


module.exports = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/example/login',
        permanent: false,
      },
    ]
  },
  serverRuntimeConfig: {},
  publicRuntimeConfig: {
    basePath: process.env.BASE_PATH || '',
  },
  head: {
    link: {
      rel: 'shortcut icon',
      href: '/favicon.ico'
    }
  },
//   async headers() {
//     return [
//       {
//         source: '/favicon1.ico',
//         headers: [
//           {
//             key: 'Cache-Control',
//             value: 'public, max-age=604800, immutable',
//           },
//         ],
//       },
//     ]
//   },
//   head: {
//   link: [
//     { rel: 'icon', type: 'image/x-icon', href: '/favicon1.ico' }
//   ]
// }
}
