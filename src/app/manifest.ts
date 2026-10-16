import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sellbar — Recommerce & Electronics Marketplace',
    short_name: 'Sellbar',
    description: 'Sell your old smartphone for instant cash with free doorstep pickup, or buy certified refurbished phones with warranty.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
