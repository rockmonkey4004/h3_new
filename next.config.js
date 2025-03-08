const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [require('remark-gfm')],
    rehypePlugins: [
      require('rehype-slug'),
      require('rehype-autolink-headings'),
      [require('rehype-highlight'), { ignoreMissing: true }],
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  images: {
    domains: ['res.cloudinary.com'],
  },
  // If you're using Netlify, this helps with redirects
  async redirects() {
    return [
      // Redirect old Jekyll URLs to new format if needed
      {
        source: '/tag/:tag',
        destination: '/topics/:tag',
        permanent: true,
      },
    ];
  },
};

module.exports = withMDX(nextConfig); 