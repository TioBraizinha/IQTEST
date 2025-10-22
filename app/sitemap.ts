// app/sitemap.ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://iqtest-rust.vercel.app';
  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // adiciona mais páginas aqui, se quiseres
    // { url: `${base}/success`, changeFrequency: 'monthly', priority: 0.8 },
  ];
}

