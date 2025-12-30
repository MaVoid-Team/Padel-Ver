/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './image-loader.js'
  },
  output: "export",

  basePath: "/Padel-Ver",
  assetPrefix: "/Padel-Ver/",

}

export default nextConfig
