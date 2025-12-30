// image-loader.js
export default function cloudinaryLoader({ src, width, quality }) {
  const isProd = process.env.NODE_ENV === 'production';
  const basePath = isProd ? '/Padel-Ver' : '';
  
  // If it's already an external URL, return it as is
  if (src.startsWith('http')) return src;

  // Otherwise, prefix it with the basePath
  return `${basePath}${src}`;
}