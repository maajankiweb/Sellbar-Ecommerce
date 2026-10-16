import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/account/',
          '/delivery/',
          '/manager/',
          '/seller/',
          '/staff/',
        ],
      },
    ],
    sitemap: 'https://sellbar.in/sitemap.xml',
  };
}
