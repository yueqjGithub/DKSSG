/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const nextConfig = {
  assetPrefix: './',
  basePath: isProd ? process.env.NEXT_PUBLIC_PUBLIC_PREFIX : '', // 域名带二级目录
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['corp-all-web-rs-test.oss-cn-hongkong.aliyuncs.com'],
  }
}

module.exports = nextConfig
